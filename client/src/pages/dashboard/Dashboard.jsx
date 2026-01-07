import React, { useEffect, useState } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { stats, fetchStats, loading, spinnerStyle, fetchTasks, createTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    console.log('Dashboard: Fetching stats and tasks...');
    fetchStats();
    fetchTasks();
  }, []);

  // Debug: Check what we're getting from API
  useEffect(() => {
    if (stats) {
      console.log('📊 Dashboard Stats:', stats);
      console.log('📊 Stats Summary:', stats.summary);
      console.log('📊 Stats Rates:', stats.rates);
      console.log('📊 Total Tasks:', stats.summary?.total);
    }
  }, [stats]);

  // Inline Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: '24px',
    padding: '48px 56px',
    color: 'white',
    marginBottom: '40px',
    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
    zIndex: 1
  };

  const welcomeStyle = {
    fontSize: '44px',
    fontWeight: '800',
    marginBottom: '12px',
    lineHeight: '1.2',
    position: 'relative',
    zIndex: 2
  };

  const subtitleStyle = {
    fontSize: '20px',
    opacity: '0.9',
    fontWeight: '500',
    position: 'relative',
    zIndex: 2
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '28px',
    marginBottom: '56px'
  };

  const statCardStyle = {
    background: 'white',
    borderRadius: '22px',
    padding: '36px 32px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  };

  const statCardHoverStyle = {
    transform: 'translateY(-10px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
  };

  const statIconStyle = (gradient) => ({
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    boxShadow: `0 10px 25px ${gradient.split(')')[0] + ', 0.3)'}`,
    flexShrink: 0
  });

  const statContentStyle = {
    flex: 1,
    minWidth: 0
  };

  const statValueStyle = {
    fontSize: '44px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '6px',
    lineHeight: '1'
  };

  const statLabelStyle = {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: '0.3px'
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

  // Add Task Modal Styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  };

  const modalStyle = {
    background: 'white',
    borderRadius: '28px',
    padding: '48px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.25)',
    position: 'relative'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#6b7280',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const modalTitleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#111827'
  };

  const modalInputStyle = {
    width: '100%',
    padding: '20px 24px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '16px',
    marginBottom: '24px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const modalInputFocusStyle = {
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
  };

  const modalButtonStyle = {
    width: '100%',
    padding: '20px 32px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px'
  };

  const modalButtonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(79, 70, 229, 0.3)'
  };

  // Quick Action Handlers
  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleViewCalendar = () => {
    toast.success('Calendar feature coming soon!');
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  const handleViewKanban = () => {
    navigate('/kanban');
  };

  const handleCreateNewTask = async () => {
    if (!newTask.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      await createTask({
        title: newTask.trim(),
        status: 'todo',
        priority: 'medium'
      });
      
      toast.success('Task created successfully!');
      setNewTask('');
      setShowAddTask(false);
      
      // Refresh stats
      fetchStats();
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  // Calculate real stats from API - IMPROVED VERSION
  const calculateStats = () => {
    console.log('📊 calculateStats called with:', stats);
    
    if (!stats) {
      console.log('📊 No stats available yet');
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0,
        todayTasks: 0,
        completionRate: 0
      };
    }

    // Your API returns: { success, message, data: { summary: {...}, rates: {...} } }
    // And we're storing response.data.data in stats
    const total = stats.summary?.total || 0;
    const completed = stats.summary?.completed || 0;
    const inProgress = stats.summary?.inProgress || 0;
    const overdue = stats.summary?.overdue || 0;
    const todayTasks = stats.summary?.todayTasks || 0;
    const completionRate = stats.rates?.completionRate || 0;

    console.log('📊 Final calculated:', {
      total, completed, inProgress, overdue, todayTasks, completionRate
    });

    return {
      total,
      completed,
      inProgress,
      overdue,
      todayTasks,
      completionRate
    };
  };

  const realStats = calculateStats();

  const statCards = [
    {
      title: 'Total Tasks',
      value: realStats.total,
      icon: '📊',
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      onClick: () => navigate('/tasks')
    },
    {
      title: 'Completed',
      value: realStats.completed,
      icon: '✅',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      onClick: () => navigate('/tasks?filter=completed')
    },
    {
      title: 'In Progress',
      value: realStats.inProgress,
      icon: '🔄',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      onClick: () => navigate('/tasks?filter=active')
    },
    {
      title: 'Overdue',
      value: realStats.overdue,
      icon: '⏰',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      onClick: () => navigate('/tasks?filter=overdue')
    },
    {
      title: 'Today',
      value: realStats.todayTasks,
      icon: '📅',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      onClick: () => navigate('/tasks?filter=today')
    },
    {
      title: 'Completion Rate',
      value: `${realStats.completionRate}%`,
      icon: '📈',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      onClick: () => navigate('/analytics')
    }
  ];

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
        <p style={loadingTextStyle}>Loading dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show loading if no stats yet
  if (!stats && !loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
        <p style={loadingTextStyle}>Loading statistics...</p>
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
        <div style={headerOverlayStyle}></div>
        <h1 style={welcomeStyle}>
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p style={subtitleStyle}>
          Here's what's happening with your tasks today
        </p>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyle}>
        {statCards.map((stat, index) => (
          <div 
            key={index}
            style={statCardStyle}
            onClick={stat.onClick}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, statCardHoverStyle);
              e.currentTarget.style.cursor = 'pointer';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={statIconStyle(stat.gradient)}>
              {stat.icon}
            </div>
            <div style={statContentStyle}>
              <div style={statValueStyle}>{stat.value}</div>
              <div style={statLabelStyle}>{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '56px'
      }}>
        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '32px',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>⚡</span>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={handleAddTask}
              style={{
                padding: '20px 28px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, modalButtonHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '24px' }}>➕</span>
              Add New Task
            </button>
            <button 
              onClick={handleViewTasks}
              style={{
                padding: '20px 28px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, modalButtonHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '24px' }}>📋</span>
              View All Tasks
            </button>
            <button 
              onClick={handleViewCalendar}
              style={{
                padding: '20px 28px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, modalButtonHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '24px' }}>📅</span>
              View Calendar
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '32px',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>📝</span>
            Quick Tips
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#4f46e5',
                flexShrink: 0
              }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>Create tasks quickly</div>
                <div style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>Use the "Add New Task" button above</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981',
                flexShrink: 0
              }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>Track your progress</div>
                <div style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>Check completion rate and overdue tasks</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#f59e0b',
                flexShrink: 0
              }}></div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>Use Kanban board</div>
                <div style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>Drag & drop tasks to manage workflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Quote */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
        borderRadius: '24px',
        padding: '48px 56px',
        textAlign: 'center',
        border: '1px solid rgba(124, 58, 237, 0.2)'
      }}>
        <p style={{
          fontSize: '20px',
          fontStyle: 'italic',
          color: '#111827',
          lineHeight: '1.6',
          marginBottom: '16px',
          fontWeight: '500'
        }}>
          "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
        </p>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          fontWeight: '600'
        }}>- Paul J. Meyer</p>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div style={modalOverlayStyle} onClick={() => setShowAddTask(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAddTask(false)}
              style={closeButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ✕
            </button>
            
            <h2 style={modalTitleStyle}>Add New Task</h2>
            
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNewTask()}
              placeholder="What needs to be done?"
              style={modalInputStyle}
              onFocus={(e) => Object.assign(e.target.style, modalInputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              autoFocus
            />
            
            <button
              onClick={handleCreateNewTask}
              disabled={!newTask.trim()}
              style={{
                ...modalButtonStyle,
                opacity: !newTask.trim() ? 0.6 : 1,
                cursor: !newTask.trim() ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => newTask.trim() && Object.assign(e.currentTarget.style, modalButtonHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;