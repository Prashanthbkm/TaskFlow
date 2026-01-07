import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';

const Analytics = () => {
  const { tasks, stats, loading } = useTasks();
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [darkMode] = useState(false);

  // Mock data for charts (you can replace with real data)
  const [productivityData, setProductivityData] = useState([
    { day: 'Mon', completed: 4, total: 10 },
    { day: 'Tue', completed: 6, total: 12 },
    { day: 'Wed', completed: 8, total: 15 },
    { day: 'Thu', completed: 3, total: 8 },
    { day: 'Fri', completed: 10, total: 14 },
    { day: 'Sat', completed: 2, total: 6 },
    { day: 'Sun', completed: 1, total: 4 },
  ]);

  const [priorityData, setPriorityData] = useState([
    { priority: 'High', count: 8, color: '#ef4444' },
    { priority: 'Medium', count: 15, color: '#f59e0b' },
    { priority: 'Low', count: 12, color: '#10b981' },
  ]);

  const calculateAnalytics = () => {
    if (!tasks.length) return;
    
    // Calculate completion rate
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
    
    // Calculate average completion time
    const tasksWithTime = tasks.filter(t => t.actualTime);
    const avgTime = tasksWithTime.length 
      ? tasksWithTime.reduce((sum, t) => sum + t.actualTime, 0) / tasksWithTime.length
      : 0;
    
    // Calculate overdue tasks
    const today = new Date();
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < today;
    }).length;
    
    return {
      completionRate: Math.round(completionRate),
      avgTime: Math.round(avgTime),
      overdueTasks,
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      todoTasks: tasks.filter(t => t.status === 'todo').length,
    };
  };

  const getTopCategories = () => {
    // Mock categories - in real app, tasks would have categories
    return [
      { name: 'Work', count: 12, color: '#8b5cf6' },
      { name: 'Personal', count: 8, color: '#3b82f6' },
      { name: 'Health', count: 5, color: '#10b981' },
      { name: 'Learning', count: 7, color: '#f59e0b' },
    ];
  };

  const getRecentActivity = () => {
    // Mock activity data
    return [
      { action: 'Task completed', task: 'Design Review', time: '2 hours ago' },
      { action: 'New task added', task: 'Team Meeting', time: '4 hours ago' },
      { action: 'Task updated', task: 'Project Plan', time: '1 day ago' },
      { action: 'Task deleted', task: 'Old Task', time: '2 days ago' },
      { action: 'Priority changed', task: 'Bug Fix', time: '3 days ago' },
    ];
  };

  const analytics = calculateAnalytics();
  const categories = getTopCategories();
  const recentActivity = getRecentActivity();

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

    subtitle: {
      fontSize: '16px',
      color: darkMode ? '#94a3b8' : '#64748b',
      fontWeight: '500'
    },

    timeRangeTabs: {
      display: 'flex',
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)',
      borderRadius: '12px',
      padding: '4px',
      width: 'fit-content',
      marginBottom: '32px'
    },

    timeRangeTab: (isActive) => ({
      padding: '10px 24px',
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

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },

    statCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    },

    statCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: darkMode 
        ? '0 30px 60px rgba(0, 0, 0, 0.4)'
        : '0 30px 60px rgba(0, 0, 0, 0.15)'
    },

    statIcon: (color) => ({
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: color + '20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      color: color,
      marginBottom: '20px'
    }),

    statNumber: {
      fontSize: '36px',
      fontWeight: '800',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '4px',
      lineHeight: '1'
    },

    statLabel: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b',
      fontWeight: '600',
      marginBottom: '12px'
    },

    statTrend: {
      fontSize: '13px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },

    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },

    chartCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)',
      height: '400px'
    },

    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },

    chartTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a'
    },

    chartSubtitle: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },

    // Simple bar chart implementation
    barChart: {
      height: '300px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '16px'
    },

    barGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      flex: 1
    },

    barContainer: {
      height: '200px',
      width: '40px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    },

    bar: (percentage, color) => ({
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: `${percentage}%`,
      background: color,
      borderRadius: '8px',
      transition: 'height 1s ease'
    }),

    barLabel: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textAlign: 'center'
    },

    pieChart: {
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },

    pieSegment: (percentage, color, startAngle = 0) => ({
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: `conic-gradient(
        ${color} 0deg ${percentage * 3.6}deg,
        transparent ${percentage * 3.6}deg 360deg
      )`,
      transform: `rotate(${startAngle}deg)`
    }),

    pieCenter: {
      position: 'absolute',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: darkMode ? '#1e293b' : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },

    pieCenterNumber: {
      fontSize: '24px',
      fontWeight: '800',
      color: darkMode ? '#f1f5f9' : '#0f172a'
    },

    pieCenterLabel: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },

    categoriesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },

    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },

    categoryItemHover: {
      transform: 'translateX(8px)',
      background: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
    },

    categoryLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    categoryColor: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: color
    }),

    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },

    activityItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },

    activityItemHover: {
      transform: 'translateX(8px)',
      background: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
    },

    activityIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },

    activityContent: {
      flex: 1
    },

    activityText: {
      fontSize: '14px',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '4px'
    },

    activityTask: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#8b5cf6'
    },

    activityTime: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginTop: '4px'
    },

    insightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px'
    },

    insightCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)'
    },

    insightTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  };

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
        <h1 style={styles.title}>Analytics Dashboard</h1>
        <p style={styles.subtitle}>
          Track your productivity and task performance
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={styles.timeRangeTabs}>
        <button 
          onClick={() => setTimeRange('week')}
          style={styles.timeRangeTab(timeRange === 'week')}
        >
          This Week
        </button>
        <button 
          onClick={() => setTimeRange('month')}
          style={styles.timeRangeTab(timeRange === 'month')}
        >
          This Month
        </button>
        <button 
          onClick={() => setTimeRange('year')}
          style={styles.timeRangeTab(timeRange === 'year')}
        >
          This Year
        </button>
      </div>

      {/* Key Metrics */}
      <div style={styles.statsGrid}>
        {/* Completion Rate */}
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon('#8b5cf6')}>📈</div>
          <div style={styles.statNumber}>
            {analytics?.completionRate || 0}%
          </div>
          <div style={styles.statLabel}>Completion Rate</div>
          <div style={{ ...styles.statTrend, color: '#10b981' }}>
            <span>↑</span> 12% from last week
          </div>
        </div>

        {/* Average Completion Time */}
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon('#10b981')}>⏱️</div>
          <div style={styles.statNumber}>
            {analytics?.avgTime || 0}h
          </div>
          <div style={styles.statLabel}>Avg. Completion Time</div>
          <div style={{ ...styles.statTrend, color: '#f59e0b' }}>
            <span>→</span> Same as last week
          </div>
        </div>

        {/* Overdue Tasks */}
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon('#ef4444')}>⚠️</div>
          <div style={styles.statNumber}>
            {analytics?.overdueTasks || 0}
          </div>
          <div style={styles.statLabel}>Overdue Tasks</div>
          <div style={{ ...styles.statTrend, color: '#ef4444' }}>
            <span>↑</span> 3 more than last week
          </div>
        </div>

        {/* Productivity Score */}
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
          }}
        >
          <div style={styles.statIcon('#f59e0b')}>🏆</div>
          <div style={styles.statNumber}>78</div>
          <div style={styles.statLabel}>Productivity Score</div>
          <div style={{ ...styles.statTrend, color: '#10b981' }}>
            <span>↑</span> 8 points improvement
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Productivity Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>Weekly Productivity</div>
              <div style={styles.chartSubtitle}>Tasks completed vs total tasks</div>
            </div>
          </div>
          
          <div style={styles.barChart}>
            {productivityData.map((day, index) => {
              const completionPercentage = (day.completed / day.total) * 100;
              const totalPercentage = 100;
              
              return (
                <div key={index} style={styles.barGroup}>
                  <div style={styles.barContainer}>
                    <div 
                      style={styles.bar(totalPercentage, darkMode ? '#374151' : '#e2e8f0')}
                    />
                    <div 
                      style={styles.bar(completionPercentage, '#8b5cf6')}
                    />
                  </div>
                  <div style={styles.barLabel}>{day.day}</div>
                  <div style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {day.completed}/{day.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <div style={styles.chartTitle}>Task Priority Distribution</div>
              <div style={styles.chartSubtitle}>Breakdown by priority level</div>
            </div>
          </div>
          
          <div style={styles.pieChart}>
            {(() => {
              const total = priorityData.reduce((sum, item) => sum + item.count, 0);
              let startAngle = 0;
              
              return (
                <>
                  {priorityData.map((item, index) => {
                    const percentage = (item.count / total) * 100;
                    const segment = (
                      <div 
                        key={index}
                        style={styles.pieSegment(percentage, item.color, startAngle)}
                      />
                    );
                    startAngle += percentage * 3.6;
                    return segment;
                  })}
                  
                  <div style={styles.pieCenter}>
                    <div style={styles.pieCenterNumber}>{total}</div>
                    <div style={styles.pieCenterLabel}>Tasks</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Insights & Categories */}
      <div style={styles.insightsGrid}>
        {/* Top Categories */}
        <div style={styles.insightCard}>
          <div style={styles.insightTitle}>
            <span>🏷️</span> Top Categories
          </div>
          
          <div style={styles.categoriesList}>
            {categories.map((category, index) => (
              <div 
                key={index}
                style={styles.categoryItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.categoryItemHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = styles.categoryItem.background;
                }}
              >
                <div style={styles.categoryLeft}>
                  <div style={styles.categoryColor(category.color)}></div>
                  <span style={{ 
                    fontWeight: '600',
                    color: darkMode ? '#f1f5f9' : '#0f172a'
                  }}>
                    {category.name}
                  </span>
                </div>
                <div style={{ 
                  fontWeight: '700',
                  color: darkMode ? '#f1f5f9' : '#0f172a'
                }}>
                  {category.count} tasks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.insightCard}>
          <div style={styles.insightTitle}>
            <span>📝</span> Recent Activity
          </div>
          
          <div style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                style={styles.activityItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.activityItemHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = styles.activityItem.background;
                }}
              >
                <div style={styles.activityIcon}>
                  {activity.action.includes('completed') ? '✅' :
                   activity.action.includes('added') ? '➕' :
                   activity.action.includes('updated') ? '✏️' :
                   activity.action.includes('deleted') ? '🗑️' : '⚡'}
                </div>
                
                <div style={styles.activityContent}>
                  <div style={styles.activityText}>
                    {activity.action}: <span style={styles.activityTask}>{activity.task}</span>
                  </div>
                  <div style={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        * {
          transition: all 0.2s ease;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .chartsGrid {
            grid-template-columns: 1fr !important;
          }
          
          .insightsGrid {
            grid-template-columns: 1fr !important;
          }
          
          .statCard {
            min-height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;