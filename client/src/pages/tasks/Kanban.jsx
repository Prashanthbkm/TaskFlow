import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';

const Kanban = () => {
  const { tasks, loading, fetchTasks, updateTaskPosition, createTask, deleteTask, updateTask, spinnerStyle } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Inline Styles
  const containerStyle = {
    maxWidth: '1400px',
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

  const subtitleStyle = {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const kanbanBoardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Changed from 4 to 3 columns
    gap: '28px',
    marginTop: '40px'
  };

  const columnStyle = (color) => ({
    background: 'white',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
    border: `2px solid ${color}20`,
    minHeight: '600px'
  });

  const columnHeaderStyle = (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${color}20`
  });

  const columnTitleStyle = (color) => ({
    fontSize: '20px',
    fontWeight: '700',
    color: color,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  });

  const taskCountStyle = {
    background: '#f3f4f6',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4b5563'
  };

  const taskListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '500px'
  };

  const taskItemStyle = {
    background: 'white',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    cursor: 'grab',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  const taskItemHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
  };

  const taskTitleStyle = {
    fontSize: '17px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
    lineHeight: '1.4'
  };

  const taskMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '16px'
  };

  const priorityBadgeStyle = (priority) => {
    const colors = {
      high: { background: '#fee2e2', color: '#dc2626', border: '#fecaca' },
      medium: { background: '#fef3c7', color: '#d97706', border: '#fde68a' },
      low: { background: '#d1fae5', color: '#059669', border: '#a7f3d0' }
    };
    
    return {
      padding: '6px 14px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      background: colors[priority]?.background || '#f3f4f6',
      color: colors[priority]?.color || '#6b7280',
      border: `1px solid ${colors[priority]?.border || '#e5e7eb'}`
    };
  };

  const taskActionsStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '16px'
  };

  const actionButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  };

  const addTaskButtonStyle = {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '32px',
    transition: 'all 0.3s ease'
  };

  const addTaskButtonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(79, 70, 229, 0.3)'
  };

  const addTaskFormStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    marginTop: '32px',
    border: '2px solid #e5e7eb'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '14px',
    fontSize: '16px',
    marginBottom: '20px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const inputFocusStyle = {
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
  };

  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    flexDirection: 'column',
    gap: '24px'
  };

  const loadingTextStyle = {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const emptyColumnStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af',
    fontSize: '15px',
    fontWeight: '500'
  };

  // Column configurations - UPDATED to match backend statuses
  const columns = [
    { id: 'todo', title: 'To Do', color: '#4f46e5', icon: '📝' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', icon: '🔄' },
    { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' }
  ];

  // Filter tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Drag & Drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      await updateTaskPosition(draggedTask._id, 0, newStatus);
      setDraggedTask(null);
    } catch (error) {
      console.error('Failed to update task position:', error);
    }
  };

  // Add new task handler
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      await createTask({
        title: newTask.trim(),
        status: 'todo',
        priority: 'medium'
      });
      setNewTask('');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  // Update task status handler
  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
        <p style={loadingTextStyle}>Loading Kanban board...</p>
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
        <h1 style={titleStyle}>Kanban Board</h1>
        <p style={subtitleStyle}>Drag and drop tasks to manage your workflow</p>
      </div>

      {/* Add Task Button */}
      <button
        style={addTaskButtonStyle}
        onClick={() => setIsAddingTask(!isAddingTask)}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, addTaskButtonHoverStyle)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span style={{ fontSize: '20px' }}>{isAddingTask ? '✕' : '➕'}</span>
        {isAddingTask ? 'Cancel' : 'Add New Task'}
      </button>

      {/* Add Task Form */}
      {isAddingTask && (
        <div style={addTaskFormStyle}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111827' }}>
            Create New Task
          </h3>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="What needs to be done?"
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Add Task
            </button>
            <button
              onClick={() => setIsAddingTask(false)}
              style={{
                padding: '16px 32px',
                background: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={kanbanBoardStyle}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              style={columnStyle(column.color)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div style={columnHeaderStyle(column.color)}>
                <div style={columnTitleStyle(column.color)}>
                  <span style={{ fontSize: '24px' }}>{column.icon}</span>
                  {column.title}
                </div>
                <div style={taskCountStyle}>{columnTasks.length}</div>
              </div>

              {/* Task List */}
              <div style={taskListStyle}>
                {columnTasks.length === 0 ? (
                  <div style={emptyColumnStyle}>
                    <span style={{ fontSize: '48px', opacity: 0.3, display: 'block', marginBottom: '12px' }}>
                      📭
                    </span>
                    No tasks here yet
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      style={taskItemStyle}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, taskItemHoverStyle)}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                      }}
                    >
                      <div style={taskTitleStyle}>{task.title}</div>
                      
                      {/* Task Meta */}
                      <div style={taskMetaStyle}>
                        <div style={priorityBadgeStyle(task.priority || 'medium')}>
                          {task.priority || 'medium'} priority
                        </div>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'New'}
                        </span>
                      </div>

                      {/* Task Actions */}
                      <div style={taskActionsStyle}>
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(task._id, 'completed')}
                            style={{
                              ...actionButtonStyle,
                              background: '#10b981',
                              color: 'white'
                            }}
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          style={{
                            ...actionButtonStyle,
                            background: '#fee2e2',
                            color: '#dc2626'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(124, 58, 237, 0.05))',
        borderRadius: '20px',
        padding: '28px',
        marginTop: '48px',
        border: '1px solid rgba(79, 70, 229, 0.1)'
      }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#4f46e5', marginBottom: '12px' }}>
          💡 How to use this Kanban board:
        </h4>
        <ul style={{ color: '#6b7280', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li><strong>Drag & Drop:</strong> Drag tasks between columns to update their status</li>
          <li><strong>Create Tasks:</strong> Click "Add New Task" to create new tasks</li>
          <li><strong>Priority:</strong> Use priority badges to identify important tasks</li>
          <li><strong>Completion:</strong> Mark tasks as complete when done</li>
          <li><strong>Delete:</strong> Remove tasks you no longer need</li>
        </ul>
      </div>
    </div>
  );
};

export default Kanban;