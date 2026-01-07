import React, { createContext, useState, useContext, useCallback } from 'react';
import { tasksAPI } from '../config/api.js';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Loading spinner style
  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  };

  // Fetch tasks with filters
  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(params);
      const { tasks, pagination, stats } = response.data.data;
      
      setTasks(tasks);
      setPagination(pagination);
      
      // Store the stats from API response
      if (stats) {
        setStats(stats);
      }
      
      return { success: true, tasks, pagination, stats };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch tasks';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch task statistics - IMPROVED VERSION
  const fetchStats = useCallback(async () => {
    try {
      const response = await tasksAPI.getStats();
      
      // The API returns { success: true, message: "...", data: {...} }
      // Make sure we handle the response properly
      if (response.data.success) {
        setStats(response.data.data);
        return { success: true, stats: response.data.data };
      } else {
        throw new Error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      
      // Don't show toast for stats failure - it might be too frequent
      // Create fallback stats from tasks if API fails
      const fallbackStats = {
        summary: {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          todo: tasks.filter(t => t.status === 'todo').length
        },
        rates: {
          completionRate: tasks.length > 0 ? 
            Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
          averageTime: 0
        }
      };
      
      setStats(fallbackStats);
      return { success: false, stats: fallbackStats };
    }
  }, [tasks]); // Add tasks as dependency

  // Create new task
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const response = await tasksAPI.create(taskData);
      const newTask = response.data.data;
      
      // Optimistic update
      setTasks(prev => [newTask, ...prev]);
      
      // Update stats (use fallback if API fails)
      try {
        await fetchStats();
      } catch (statsError) {
        // Silently handle stats error - we already have fallback
      }
      
      toast.success('Task created successfully!');
      return { success: true, task: newTask };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create task';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update task - FIXED: oldTask scope issue
  const updateTask = async (id, updates) => {
    let oldTask = null; // Declare here so it's available in catch block
    
    try {
      // Save old task for rollback
      oldTask = tasks.find(task => task._id === id);
      
      if (!oldTask) {
        throw new Error('Task not found');
      }
      
      // Optimistic update
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, ...updates } : task
      ));

      // Always send full task data to backend to avoid validation errors
      const payload = {
        title: updates.title ?? oldTask.title,
        status: updates.status ?? oldTask.status,
        priority: updates.priority ?? oldTask.priority,
        description: updates.description ?? oldTask.description,
        dueDate: updates.dueDate ?? oldTask.dueDate,
        actualTime: updates.actualTime ?? oldTask.actualTime,
      };

      const response = await tasksAPI.update(id, payload);
      const updatedTask = response.data.data;
      
      // Update with actual response
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      
      // Update stats (use fallback if API fails)
      try {
        await fetchStats();
      } catch (statsError) {
        // Silently handle stats error
      }
      
      toast.success('Task updated successfully!');
      return { success: true, task: updatedTask };
    } catch (error) {
      // Rollback on error
      if (oldTask) {
        setTasks(prev => prev.map(task => 
          task._id === id ? oldTask : task
        ));
      }
      
      const errorMessage = error.response?.data?.error || 'Failed to update task';
      console.error('Update task error:', errorMessage, error.response?.data);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      // Optimistic update
      setTasks(prev => prev.filter(task => task._id !== id));
      
      await tasksAPI.delete(id);
      
      // Update stats (use fallback if API fails)
      try {
        await fetchStats();
      } catch (statsError) {
        // Silently handle stats error
      }
      
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      // Note: We don't rollback deletion for better UX
      const errorMessage = error.response?.data?.error || 'Failed to delete task';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update task position (for drag & drop)
  const updateTaskPosition = async (id, position, status) => {
    try {
      await tasksAPI.updatePosition(id, position, status);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update task position';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update task time tracking
  const updateTaskTime = async (id, actualTime) => {
    try {
      const response = await tasksAPI.updateTime(id, actualTime);
      const updatedTask = response.data.data;
      
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      
      return { success: true, task: updatedTask };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update time';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear all completed tasks
  const clearCompleted = async () => {
    try {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      
      // Delete all completed tasks in parallel
      await Promise.all(
        completedTasks.map(task => tasksAPI.delete(task._id))
      );
      
      // Update local state
      setTasks(prev => prev.filter(task => task.status !== 'completed'));
      
      // Update stats (use fallback if API fails)
      try {
        await fetchStats();
      } catch (statsError) {
        // Silently handle stats error
      }
      
      toast.success(`Cleared ${completedTasks.length} completed tasks!`);
      return { success: true, count: completedTasks.length };
    } catch (error) {
      toast.error('Failed to clear completed tasks');
      return { success: false, error: 'Failed to clear completed tasks' };
    }
  };

  const value = {
    tasks,
    loading,
    stats,
    pagination,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    updateTaskPosition,
    updateTaskTime,
    clearCompleted,
    spinnerStyle
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};