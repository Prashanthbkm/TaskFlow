import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeHover, setActiveHover] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Detect mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    document.documentElement.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
    document.documentElement.style.color = darkMode ? '#f1f5f9' : '#0f172a';
  }, [darkMode]);

  // Enhanced Styles with Glassmorphism
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },

    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 0
    },

    shape: (size, top, left, rotate, color, opacity = 0.05) => ({
      position: 'absolute',
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      borderRadius: '50%',
      top: top,
      left: left,
      opacity: opacity,
      filter: 'blur(40px)',
      animation: 'float 20s infinite ease-in-out alternate'
    }),

    mobileToggle: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 100,
      padding: '12px',
      background: darkMode 
        ? 'rgba(30, 41, 59, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
      borderRadius: '14px',
      boxShadow: `0 8px 32px ${darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    sidebar: {
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? '0' : '-280px',
      width: '280px',
      height: '100vh',
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderRight: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
      boxShadow: `0 0 40px ${darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 50,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },

    mainContent: {
      flex: 1,
      minHeight: '100vh',
      overflowY: 'auto',
      paddingLeft: isMobile ? '0' : (sidebarOpen ? '280px' : '0'),
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      zIndex: 1
    },

    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 40,
      transition: 'opacity 0.3s ease',
      opacity: sidebarOpen && isMobile ? 1 : 0,
      pointerEvents: sidebarOpen && isMobile ? 'all' : 'none'
    },

    logoContainer: {
      padding: '32px 24px',
      borderBottom: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`
    },

    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden',
      padding: '12px',
      borderRadius: '18px',
      background: darkMode 
        ? 'rgba(30, 41, 59, 0.4)'
        : 'rgba(255, 255, 255, 0.4)',
      border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`
    },

    logoIcon: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
      position: 'relative',
      overflow: 'hidden'
    },

    logoGlow: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
      animation: 'pulseGlow 3s infinite alternate'
    },

    logoText: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.2'
    },

    logoSubtext: {
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
      fontWeight: '500',
      marginTop: '4px',
      letterSpacing: '1px'
    },

    userProfile: {
      padding: '24px',
      borderBottom: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`
    },

    userContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      cursor: 'pointer',
      padding: '16px',
      borderRadius: '18px',
      transition: 'all 0.3s ease',
      background: darkMode 
        ? 'rgba(30, 41, 59, 0.4)'
        : 'rgba(255, 255, 255, 0.4)',
      border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`
    },

    avatar: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: '700',
      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
      position: 'relative',
      overflow: 'hidden'
    },

    avatarStatus: {
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      width: '14px',
      height: '14px',
      background: '#10b981',
      borderRadius: '50%',
      border: `2px solid ${darkMode ? '#0f172a' : '#f8fafc'}`
    },

    userInfo: {
      flex: 1,
      minWidth: 0
    },

    userName: {
      fontSize: '16px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    userEmail: {
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    nav: {
      flex: 1,
      padding: '24px 16px',
      overflowY: 'auto'
    },

    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },

    navItem: {
      marginBottom: '8px',
      position: 'relative'
    },

    navLink: (isActive, isHovered) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '18px 20px',
      textDecoration: 'none',
      borderRadius: '16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: isActive 
        ? darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
        : 'transparent',
      color: isActive 
        ? darkMode ? '#a78bfa' : '#8b5cf6'
        : darkMode ? '#cbd5e1' : '#475569',
      borderLeft: isActive ? '4px solid #8b5cf6' : '4px solid transparent',
      fontWeight: isActive ? '600' : '500',
      fontSize: '15px',
      position: 'relative',
      overflow: 'hidden',
      transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
      boxShadow: isActive 
        ? `0 10px 30px ${darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`
        : 'none'
    }),

    navLinkHover: {
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.6)',
      transform: 'translateX(8px)'
    },

    navIcon: {
      fontSize: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      transition: 'transform 0.3s ease'
    },

    bottomActions: {
      padding: '24px',
      borderTop: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.5)'
        : 'rgba(255, 255, 255, 0.5)'
    },

    actionButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'transparent',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: darkMode ? '#cbd5e1' : '#475569',
      fontSize: '15px',
      fontWeight: '500',
      marginBottom: '12px'
    },

    actionButtonHover: {
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.6)',
      transform: 'translateY(-2px)'
    },

    actionLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#ef4444',
      fontSize: '15px',
      fontWeight: '600'
    },

    logoutButtonHover: {
      background: 'rgba(239, 68, 68, 0.2)',
      transform: 'translateY(-2px)'
    }
  };

  // Navigation Items with better icons
  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', badge: '' },
    { path: '/tasks', icon: '✅', label: 'Tasks', badge: 'New' },
    { path: '/kanban', icon: '📋', label: 'Kanban Board', badge: '' },
    { path: '/tasks/calendar', icon: '📅', label: 'Calendar' },
  { path: '/tasks/analytics', icon: '📈', label: 'Analytics' },
  { path: '/tasks/settings', icon: '⚙️', label: 'Settings' },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating Background Shapes */}
      <div style={styles.floatingShapes}>
        <div style={styles.shape('400px', '10%', '5%', 0, '#8b5cf6', 0.1)}></div>
        <div style={styles.shape('300px', '60%', '80%', 0, '#3b82f6', 0.08)}></div>
        <div style={styles.shape('200px', '20%', '70%', 0, '#ec4899', 0.05)}></div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.mobileToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 16px 40px ${darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`;
          }}
        >
          <span style={{ 
            fontSize: '24px', 
            color: darkMode ? '#cbd5e1' : '#475569',
            transition: 'transform 0.3s ease',
            transform: sidebarOpen ? 'rotate(90deg)' : 'rotate(0)'
          }}>
            ☰
          </span>
        </button>
      )}

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div 
            style={styles.logo}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.logoIcon}>
              <div style={styles.logoGlow}></div>
              <span style={{ fontSize: '28px', position: 'relative', zIndex: 1 }}>✅</span>
            </div>
            <div>
              <div style={styles.logoText}>TaskFlow Pro</div>
              <div style={styles.logoSubtext}>PREMIUM EDITION</div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div style={styles.userProfile}>
          <div 
            style={styles.userContainer}
            onClick={handleUserMenuClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
              <div style={styles.avatarStatus}></div>
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>
                {user?.name || 'User'}
              </div>
              <div style={styles.userEmail}>
                {user?.email || 'user@example.com'}
              </div>
            </div>
            <span style={{ 
              fontSize: '18px',
              color: darkMode ? '#94a3b8' : '#64748b',
              transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} style={styles.navItem}>
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => 
                      styles.navLink(isActive, activeHover === item.path)
                    }
                    onMouseEnter={() => setActiveHover(item.path)}
                    onMouseLeave={() => setActiveHover(null)}
                    onClick={closeSidebarOnMobile}
                  >
                    <span style={{
                      ...styles.navIcon,
                      transform: activeHover === item.path ? 'scale(1.2)' : 'scale(1)'
                    }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        color: 'white'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div style={styles.bottomActions}>
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            style={styles.actionButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.actionButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.actionLeft}>
              <span style={styles.navIcon}>{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span style={{ 
              fontSize: '12px', 
              color: darkMode ? '#94a3b8' : '#64748b',
              padding: '4px 10px',
              borderRadius: '12px',
              background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.6)'
            }}>
              {darkMode ? 'Switch' : 'Switch'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.logoutButtonHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.actionLeft}>
              <span style={styles.navIcon}>🚪</span>
              <span>Logout</span>
            </div>
            <span style={{ 
              fontSize: '12px',
              color: '#ef4444',
              opacity: 0.8
            }}>
              Exit Session
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={{ 
          padding: isMobile ? '24px 16px' : '32px 40px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Outlet />
        </div>
      </main>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulseGlow {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.2); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.4)'};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)'};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.6)'};
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          main > div {
            padding: 20px 16px !important;
          }
        }
        
        /* Selection style */
        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: ${darkMode ? '#f1f5f9' : '#0f172a'};
        }
      `}</style>
    </div>
  );
};

export default Layout;