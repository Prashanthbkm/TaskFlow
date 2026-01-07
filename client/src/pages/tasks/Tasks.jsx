import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';

const Tasks = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, clearCompleted } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Inline Styles (Fixed border warning)
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  };

  const headerStyle = {
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px'
  };

  // ... [keep all other styles the same until checkbox] ...

  // FIXED: No more border/borderColor mixing
  const checkboxStyle = (completed) => ({
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: completed ? '#4f46e5' : '#d1d5db',
    backgroundColor: completed ? '#4f46e5' : 'transparent',
    color: completed ? 'white' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  });

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && task.status !== 'completed') return false;
    if (filter === 'active' && task.status === 'completed') return false;
    if (filter === 'high' && task.priority !== 'high') return false;
    
    if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  // Add task handler
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      await createTask({
        title: newTask.trim(),
        status: 'todo',
        priority: 'medium'
      });
      setNewTask('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // ✅ FIXED: Toggle task completion - Always send full payload
  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    await updateTask(task._id, {
      title: task.title,       // ✅ REQUIRED by backend
      status: newStatus,
      priority: task.priority,
      description: task.description || '',
      dueDate: task.dueDate || null
    });
  };

  // Start editing task
  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
  };

  // ✅ FIXED: Save edited task - Always send full payload
  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      setEditingTask(null);
      return;
    }

    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    await updateTask(taskId, {
      title: editTitle.trim(),
      status: task.status,
      priority: task.priority,
      description: task.description || '',
      dueDate: task.dueDate || null
    });

    setEditingTask(null);
    setEditTitle('');
  };

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  // Clear completed tasks (you'll need to add this back to TaskContext if needed)
  const handleClearCompleted = async () => {
    if (window.confirm('Are you sure you want to clear all completed tasks?')) {
      // If clearCompleted function is not in context, you can implement it here
      const completedTasks = tasks.filter(task => task.status === 'completed');
      for (const task of completedTasks) {
        await deleteTask(task._id);
      }
    }
  };

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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={spinnerStyle}></div>
        <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '500' }}>
          Loading tasks...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Task Management</h1>
        <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '500' }}>
          Manage all your tasks in one place
        </p>
      </div>

      {/* Add Task Section */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        marginBottom: '40px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
          Add New Task
        </h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="What needs to be done?"
            style={{
              flex: 1,
              padding: '18px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim()}
            style={{
              padding: '18px 32px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>➕</span>
            Add Task
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
          Press Enter or click Add Task to create a new task
        </p>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '12px 24px',
              background: filter === 'all' ? '#4f46e5' : '#f3f4f6',
              color: filter === 'all' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            style={{
              padding: '12px 24px',
              background: filter === 'active' ? '#4f46e5' : '#f3f4f6',
              color: filter === 'active' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Active ({tasks.filter(t => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            style={{
              padding: '12px 24px',
              background: filter === 'completed' ? '#4f46e5' : '#f3f4f6',
              color: filter === 'completed' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          {tasks.filter(t => t.status === 'completed').length > 0 && (
            <button
              onClick={handleClearCompleted}
              style={{
                padding: '12px 24px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🗑️ Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb'
      }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '64px', opacity: 0.3, marginBottom: '20px' }}>
              {searchTerm ? '🔍' : '📝'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
              {searchTerm ? 'No tasks found' : 'No tasks yet'}
            </h3>
            <p style={{ color: '#9ca3af' }}>
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first task above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '28px',
                background: task.status === 'completed' ? '#f9fafb' : 'white',
                borderBottom: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
            >
              {/* FIXED Checkbox */}
              <div
                onClick={() => handleToggleComplete(task)}
                style={checkboxStyle(task.status === 'completed')}
              >
                {task.status === 'completed' && '✓'}
              </div>

              {/* Task Content */}
              <div style={{ flex: 1 }}>
                {editingTask === task._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(task._id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(task._id)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #4f46e5',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    autoFocus
                  />
                ) : (
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: task.status === 'completed' ? '#9ca3af' : '#111827',
                    marginBottom: '8px',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: task.status === 'todo' ? '#f3f4f6' : 
                               task.status === 'in-progress' ? '#fef3c7' : '#d1fae5',
                    color: task.status === 'todo' ? '#6b7280' : 
                          task.status === 'in-progress' ? '#d97706' : '#059669',
                    border: '1px solid',
                    borderColor: task.status === 'todo' ? '#e5e7eb' : 
                                task.status === 'in-progress' ? '#fde68a' : '#a7f3d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {task.status === 'todo' && '⏳'}
                    {task.status === 'in-progress' && '🔄'}
                    {task.status === 'completed' && '✅'}
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  
                  {task.priority && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: task.priority === 'high' ? '#fee2e2' : 
                                 task.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                      color: task.priority === 'high' ? '#dc2626' : 
                            task.priority === 'medium' ? '#d97706' : '#059669'
                    }}>
                      {task.priority} priority
                    </span>
                  )}
                  
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Task Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => editingTask === task._id ? handleSaveEdit(task._id) : handleEditTask(task)}
                  style={{
                    padding: '10px',
                    background: editingTask === task._id ? '#10b981' : '#f3f4f6',
                    color: editingTask === task._id ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {editingTask === task._id ? '💾' : '✏️'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{
                    padding: '10px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '32px',
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '16px',
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <div>
          Total tasks: <strong>{tasks.length}</strong>
        </div>
        <div>
          Completed: <strong>{tasks.filter(t => t.status === 'completed').length}</strong>
        </div>
        <div>
          Remaining: <strong>{tasks.filter(t => t.status !== 'completed').length}</strong>
        </div>
        <div>
          Completion rate: <strong>{tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%</strong>
        </div>
      </div>
    </div>
  );
};

export default Tasks;