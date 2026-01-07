import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import toast from 'react-hot-toast';

const Calendar = () => {
  const { tasks, loading, fetchTasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Dark mode state (should come from context or localStorage)
  const [darkMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const days = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        tasks: []
      });
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        tasks: dayTasks
      });
    }
    
    // Next month's days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        tasks: []
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getTaskCountByStatus = () => {
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return { todo, inProgress, completed };
  };

  const getTasksDueThisWeek = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const handleDayClick = (day) => {
    setSelectedTask(null);
    setCurrentDate(day.date);
    if (view !== 'day') {
      setView('day');
    }
  };

  const handleTaskClick = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '32px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },

    title: {
      fontSize: '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px'
    },

    controls: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    },

    button: (variant = 'primary') => ({
      padding: '12px 24px',
      background: variant === 'primary' 
        ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
        : darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      color: variant === 'primary' ? 'white' : darkMode ? '#cbd5e1' : '#475569',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }),

    dateNavigator: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      padding: '12px 24px',
      borderRadius: '16px',
      backdropFilter: 'blur(10px)'
    },

    monthTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      minWidth: '200px',
      textAlign: 'center'
    },

    viewTabs: {
      display: 'flex',
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)',
      borderRadius: '12px',
      padding: '4px'
    },

    viewTab: (isActive) => ({
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: isActive 
        ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
        : 'transparent',
      color: isActive ? 'white' : darkMode ? '#94a3b8' : '#64748b',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),

    calendarContainer: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px',
      height: 'calc(100vh - 200px)'
    },

    calendarGrid: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)'
    },

    daysHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '16px'
    },

    dayHeader: {
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '700',
      color: darkMode ? '#94a3b8' : '#64748b',
      padding: '12px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },

    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px'
    },

    dayCell: (day) => ({
      minHeight: '120px',
      padding: '12px',
      background: day.isCurrentMonth 
        ? darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.9)'
        : darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.6)',
      borderRadius: '12px',
      border: `2px solid ${day.isToday ? '#8b5cf6' : 'transparent'}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      opacity: day.isCurrentMonth ? 1 : 0.6
    }),

    dayNumber: (day) => ({
      fontSize: '16px',
      fontWeight: day.isToday ? '700' : '600',
      color: day.isToday 
        ? '#8b5cf6'
        : day.isCurrentMonth 
          ? (darkMode ? '#f1f5f9' : '#0f172a')
          : darkMode ? '#64748b' : '#94a3b8',
      marginBottom: '8px'
    }),

    taskDot: (status) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: status === 'completed' ? '#10b981' :
                 status === 'in-progress' ? '#f59e0b' :
                 '#8b5cf6',
      display: 'inline-block',
      marginRight: '4px'
    }),

    taskItem: {
      fontSize: '12px',
      padding: '6px 8px',
      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '8px',
      marginBottom: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: darkMode ? '#cbd5e1' : '#475569'
    },

    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },

    statsCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)'
    },

    statsTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px'
    },

    statBox: {
      textAlign: 'center',
      padding: '20px',
      borderRadius: '16px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)'
    },

    statNumber: {
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '4px'
    },

    statLabel: {
      fontSize: '13px',
      fontWeight: '600',
      opacity: 0.8
    },

    upcomingTasks: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },

    taskList: {
      flex: 1,
      overflowY: 'auto'
    },

    upcomingTaskItem: {
      padding: '16px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '12px',
      marginBottom: '12px',
      borderLeft: '4px solid #8b5cf6',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },

    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    },

    modal: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      animation: 'slideUp 0.3s ease'
    }
  };

  const calendarDays = generateCalendarDays();
  const taskStats = getTaskCountByStatus();
  const upcomingTasks = getTasksDueThisWeek();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Calendar</h1>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Manage your tasks with our interactive calendar
          </p>
        </div>
        
        <div style={styles.controls}>
          <button 
            onClick={navigateToToday}
            style={styles.button('secondary')}
          >
            📅 Today
          </button>
          <button 
            style={styles.button()}
            onClick={() => {/* Add new task */}}
          >
            ➕ Add Task
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px' 
      }}>
        <div style={styles.dateNavigator}>
          <button 
            onClick={() => navigateMonth(-1)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '20px', 
              cursor: 'pointer',
              color: darkMode ? '#cbd5e1' : '#475569'
            }}
          >
            ◀
          </button>
          
          <div style={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          
          <button 
            onClick={() => navigateMonth(1)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '20px', 
              cursor: 'pointer',
              color: darkMode ? '#cbd5e1' : '#475569'
            }}
          >
            ▶
          </button>
        </div>

        <div style={styles.viewTabs}>
          <button 
            onClick={() => setView('month')}
            style={styles.viewTab(view === 'month')}
          >
            Month
          </button>
          <button 
            onClick={() => setView('week')}
            style={styles.viewTab(view === 'week')}
          >
            Week
          </button>
          <button 
            onClick={() => setView('day')}
            style={styles.viewTab(view === 'day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.calendarContainer}>
        {/* Calendar Grid */}
        <div style={styles.calendarGrid}>
          <div style={styles.daysHeader}>
            {dayNames.map(day => (
              <div key={day} style={styles.dayHeader}>{day}</div>
            ))}
          </div>
          
          <div style={styles.daysGrid}>
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                style={styles.dayCell(day)}
                onClick={() => handleDayClick(day)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.dayNumber(day)}>
                  {day.date.getDate()}
                </div>
                
                {day.tasks.slice(0, 3).map((task, taskIndex) => (
                  <div 
                    key={taskIndex}
                    style={styles.taskItem}
                    onClick={(e) => handleTaskClick(task, e)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = darkMode 
                        ? 'rgba(139, 92, 246, 0.3)' 
                        : 'rgba(139, 92, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = darkMode 
                        ? 'rgba(30, 41, 59, 0.8)' 
                        : 'rgba(241, 245, 249, 0.8)';
                    }}
                  >
                    <span style={styles.taskDot(task.status)}></span>
                    {task.title}
                  </div>
                ))}
                
                {day.tasks.length > 3 && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    marginTop: '4px'
                  }}>
                    +{day.tasks.length - 3} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Statistics Card */}
          <div style={styles.statsCard}>
            <div style={styles.statsTitle}>
              <span>📊</span> Task Overview
            </div>
            
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={{ ...styles.statNumber, color: '#8b5cf6' }}>
                  {tasks.length}
                </div>
                <div style={styles.statLabel}>Total Tasks</div>
              </div>
              
              <div style={styles.statBox}>
                <div style={{ ...styles.statNumber, color: '#f59e0b' }}>
                  {taskStats.inProgress}
                </div>
                <div style={styles.statLabel}>In Progress</div>
              </div>
              
              <div style={styles.statBox}>
                <div style={{ ...styles.statNumber, color: '#10b981' }}>
                  {taskStats.completed}
                </div>
                <div style={styles.statLabel}>Completed</div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div style={{ ...styles.statsCard, flex: 1 }}>
            <div style={styles.statsTitle}>
              <span>⏰</span> Upcoming Tasks
              <span style={{ 
                marginLeft: 'auto', 
                fontSize: '12px', 
                color: '#8b5cf6',
                fontWeight: '600'
              }}>
                {upcomingTasks.length} tasks
              </span>
            </div>
            
            <div style={styles.taskList}>
              {upcomingTasks.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}>
                  No upcoming tasks
                </div>
              ) : (
                upcomingTasks.map((task, index) => (
                  <div 
                    key={index}
                    style={styles.upcomingTaskItem}
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTaskModal(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.background = darkMode 
                        ? 'rgba(139, 92, 246, 0.2)' 
                        : 'rgba(139, 92, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = darkMode 
                        ? 'rgba(30, 41, 59, 0.6)' 
                        : 'rgba(241, 245, 249, 0.8)';
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600',
                        color: darkMode ? '#f1f5f9' : '#0f172a'
                      }}>
                        {task.title}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: task.status === 'completed' ? '#10b981' :
                                  task.status === 'in-progress' ? '#f59e0b' :
                                  '#8b5cf6',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {task.status}
                      </span>
                    </div>
                    
                    {task.dueDate && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: darkMode ? '#94a3b8' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>📅</span>
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <div 
          style={styles.modalOverlay}
          onClick={() => setShowTaskModal(false)}
        >
          <div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                color: darkMode ? '#f1f5f9' : '#0f172a'
              }}>
                Task Details
              </h2>
              <button 
                onClick={() => setShowTaskModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: darkMode ? '#f1f5f9' : '#0f172a',
                marginBottom: '8px'
              }}>
                {selectedTask.title}
              </div>
              
              {selectedTask.description && (
                <div style={{ 
                  color: darkMode ? '#cbd5e1' : '#475569',
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}>
                  {selectedTask.description}
                </div>
              )}
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ 
                  fontSize: '13px', 
                  color: darkMode ? '#94a3b8' : '#64748b',
                  marginBottom: '4px'
                }}>
                  Status
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: selectedTask.status === 'completed' ? '#10b98120' :
                            selectedTask.status === 'in-progress' ? '#f59e0b20' :
                            '#8b5cf620',
                  color: selectedTask.status === 'completed' ? '#10b981' :
                        selectedTask.status === 'in-progress' ? '#f59e0b' :
                        '#8b5cf6',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  {selectedTask.status}
                </div>
              </div>
              
              <div>
                <div style={{ 
                  fontSize: '13px', 
                  color: darkMode ? '#94a3b8' : '#64748b',
                  marginBottom: '4px'
                }}>
                  Priority
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: selectedTask.priority === 'high' ? '#ef444420' :
                            selectedTask.priority === 'medium' ? '#f59e0b20' :
                            '#10b98120',
                  color: selectedTask.priority === 'high' ? '#ef4444' :
                        selectedTask.priority === 'medium' ? '#f59e0b' :
                        '#10b981',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  {selectedTask.priority}
                </div>
              </div>
              
              {selectedTask.dueDate && (
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    marginBottom: '4px'
                  }}>
                    Due Date
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                    color: darkMode ? '#f1f5f9' : '#0f172a',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>📅</span>
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '12px 24px',
                background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                border: 'none',
                borderRadius: '12px',
                color: darkMode ? '#cbd5e1' : '#475569',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Edit Task
              </button>
              <button style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(40px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Calendar;