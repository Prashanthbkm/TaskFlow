import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: '',
    bio: '',
    jobTitle: '',
    company: '',
    website: '',
    location: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In real app, this would call updateProfile API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleExportData = () => {
    toast.success('Export started. You will receive an email shortly.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion requested. Check your email for confirmation.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'data', label: 'Data', icon: '💾' },
  ];

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

    mainContainer: {
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      gap: '32px',
      maxWidth: '1200px',
      margin: '0 auto'
    },

    sidebar: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)',
      height: 'fit-content'
    },

    tabList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },

    tab: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '18px 20px',
      background: isActive 
        ? darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
        : 'transparent',
      border: 'none',
      borderRadius: '16px',
      color: isActive 
        ? darkMode ? '#a78bfa' : '#8b5cf6'
        : darkMode ? '#cbd5e1' : '#475569',
      fontSize: '15px',
      fontWeight: isActive ? '600' : '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'left',
      width: '100%'
    }),

    tabHover: {
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      transform: 'translateX(8px)'
    },

    content: {
      background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: darkMode 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)'
    },

    section: {
      marginBottom: '40px',
      animation: 'fadeIn 0.3s ease'
    },

    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    sectionSubtitle: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginBottom: '32px',
      lineHeight: '1.6'
    },

    avatarSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      marginBottom: '40px'
    },

    avatarContainer: {
      position: 'relative'
    },

    avatar: {
      width: '120px',
      height: '120px',
      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '48px',
      fontWeight: '700',
      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)'
    },

    avatarEditButton: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      width: '40px',
      height: '40px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.3s ease'
    },

    avatarInfo: {
      flex: 1
    },

    avatarName: {
      fontSize: '24px',
      fontWeight: '700',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '4px'
    },

    avatarEmail: {
      fontSize: '16px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginBottom: '12px'
    },

    avatarJoined: {
      fontSize: '14px',
      color: darkMode ? '#64748b' : '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    },

    formGroup: {
      marginBottom: '24px'
    },

    formGroupFull: {
      gridColumn: 'span 2'
    },

    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '10px'
    },

    input: {
      width: '100%',
      padding: '16px 20px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      border: `2px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
      borderRadius: '12px',
      fontSize: '15px',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      transition: 'all 0.3s ease',
      outline: 'none'
    },

    inputFocus: {
      borderColor: '#8b5cf6',
      boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.1)'
    },

    textarea: {
      width: '100%',
      padding: '16px 20px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      border: `2px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
      borderRadius: '12px',
      fontSize: '15px',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      transition: 'all 0.3s ease',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      fontFamily: 'inherit'
    },

    switchContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      borderRadius: '16px',
      marginBottom: '12px',
      transition: 'all 0.3s ease'
    },

    switchContainerHover: {
      transform: 'translateX(8px)',
      background: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
    },

    switchLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    switchIcon: {
      fontSize: '24px'
    },

    switchInfo: {
      flex: 1
    },

    switchTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      marginBottom: '4px'
    },

    switchDescription: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },

    switch: (isOn) => ({
      width: '52px',
      height: '28px',
      background: isOn ? '#8b5cf6' : darkMode ? '#374151' : '#cbd5e1',
      borderRadius: '14px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),

    switchKnob: (isOn) => ({
      position: 'absolute',
      top: '2px',
      left: isOn ? '26px' : '2px',
      width: '24px',
      height: '24px',
      background: 'white',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    }),

    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '40px'
    },

    button: (variant = 'primary') => ({
      padding: '16px 32px',
      background: variant === 'primary' 
        ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
        : variant === 'danger'
        ? '#ef4444'
        : darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
      color: variant === 'primary' || variant === 'danger' ? 'white' : darkMode ? '#cbd5e1' : '#475569',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }),

    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },

    dangerZone: {
      padding: '32px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '2px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      marginTop: '40px'
    },

    dangerTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#ef4444',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    dangerText: {
      fontSize: '15px',
      color: darkMode ? '#fca5a5' : '#dc2626',
      marginBottom: '24px',
      lineHeight: '1.6'
    }
  };

  const renderProfileTab = () => (
    <div style={styles.section}>
      <div style={styles.avatarSection}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {profileData.name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div 
            style={styles.avatarEditButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✏️
          </div>
        </div>
        
        <div style={styles.avatarInfo}>
          <div style={styles.avatarName}>{profileData.name || 'User'}</div>
          <div style={styles.avatarEmail}>{profileData.email || 'user@example.com'}</div>
          <div style={styles.avatarJoined}>
            <span>📅</span>
            Joined January 2024
          </div>
        </div>
      </div>

      <div style={styles.sectionTitle}>Personal Information</div>
      
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Job Title</label>
          <input
            type="text"
            value={profileData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="e.g., Software Developer"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Company</label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter company name"
          />
        </div>

        <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
          <label style={styles.label}>Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            style={styles.textarea}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          style={styles.button('primary')}
          onMouseEnter={(e) => !isSaving && Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => !isSaving && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {isSaving ? (
            <>
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Saving...
            </>
          ) : (
            <>
              💾 Save Changes
            </>
          )}
        </button>
        
        <button
          onClick={() => setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            avatar: '',
            bio: '',
            jobTitle: '',
            company: '',
            website: '',
            location: ''
          })}
          style={styles.button('secondary')}
        >
          ↩️ Reset
        </button>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>App Preferences</div>
      <p style={styles.sectionSubtitle}>
        Customize your TaskFlow experience
      </p>

      {/* Theme Preference */}
      <div 
        style={styles.switchContainer}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.switchContainerHover)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = styles.switchContainer.background;
        }}
      >
        <div style={styles.switchLeft}>
          <div style={styles.switchIcon}>🌙</div>
          <div style={styles.switchInfo}>
            <div style={styles.switchTitle}>Dark Mode</div>
            <div style={styles.switchDescription}>
              Switch between light and dark theme
            </div>
          </div>
        </div>
        
        <div 
          style={styles.switch(darkMode)}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div style={styles.switchKnob(darkMode)}></div>
        </div>
      </div>

      {/* Auto Save */}
      <div 
        style={styles.switchContainer}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.switchContainerHover)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = styles.switchContainer.background;
        }}
      >
        <div style={styles.switchLeft}>
          <div style={styles.switchIcon}>💾</div>
          <div style={styles.switchInfo}>
            <div style={styles.switchTitle}>Auto Save</div>
            <div style={styles.switchDescription}>
              Automatically save your work
            </div>
          </div>
        </div>
        
        <div 
          style={styles.switch(autoSave)}
          onClick={() => setAutoSave(!autoSave)}
        >
          <div style={styles.switchKnob(autoSave)}></div>
        </div>
      </div>

      {/* Language Selector */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Language</label>
        <select 
          style={styles.input}
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* Timezone */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Timezone</label>
        <select 
          style={styles.input}
          defaultValue="utc"
        >
          <option value="utc">UTC</option>
          <option value="est">Eastern Time</option>
          <option value="pst">Pacific Time</option>
          <option value="cet">Central European Time</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Notification Settings</div>
      <p style={styles.sectionSubtitle}>
        Control how and when you receive notifications
      </p>

      {/* Push Notifications */}
      <div 
        style={styles.switchContainer}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.switchContainerHover)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = styles.switchContainer.background;
        }}
      >
        <div style={styles.switchLeft}>
          <div style={styles.switchIcon}>📱</div>
          <div style={styles.switchInfo}>
            <div style={styles.switchTitle}>Push Notifications</div>
            <div style={styles.switchDescription}>
              Receive push notifications in your browser
            </div>
          </div>
        </div>
        
        <div 
          style={styles.switch(notifications)}
          onClick={() => setNotifications(!notifications)}
        >
          <div style={styles.switchKnob(notifications)}></div>
        </div>
      </div>

      {/* Email Notifications */}
      <div 
        style={styles.switchContainer}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.switchContainerHover)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = styles.switchContainer.background;
        }}
      >
        <div style={styles.switchLeft}>
          <div style={styles.switchIcon}>📧</div>
          <div style={styles.switchInfo}>
            <div style={styles.switchTitle}>Email Notifications</div>
            <div style={styles.switchDescription}>
              Receive email updates about your tasks
            </div>
          </div>
        </div>
        
        <div 
          style={styles.switch(emailNotifications)}
          onClick={() => setEmailNotifications(!emailNotifications)}
        >
          <div style={styles.switchKnob(emailNotifications)}></div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={styles.sectionTitle}>Notification Types</div>
        
        <div style={styles.formGrid}>
          <div style={styles.switchContainer}>
            <div style={styles.switchInfo}>
              <div style={styles.switchTitle}>Task Reminders</div>
              <div style={styles.switchDescription}>
                Remind me about upcoming tasks
              </div>
            </div>
            <div style={styles.switch(true)}>
              <div style={styles.switchKnob(true)}></div>
            </div>
          </div>

          <div style={styles.switchContainer}>
            <div style={styles.switchInfo}>
              <div style={styles.switchTitle}>Daily Summary</div>
              <div style={styles.switchDescription}>
                Daily summary of completed tasks
              </div>
            </div>
            <div style={styles.switch(true)}>
              <div style={styles.switchKnob(true)}></div>
            </div>
          </div>

          <div style={styles.switchContainer}>
            <div style={styles.switchInfo}>
              <div style={styles.switchTitle}>Weekly Reports</div>
              <div style={styles.switchDescription}>
                Weekly productivity reports
              </div>
            </div>
            <div style={styles.switch(false)}>
              <div style={styles.switchKnob(false)}></div>
            </div>
          </div>

          <div style={styles.switchContainer}>
            <div style={styles.switchInfo}>
              <div style={styles.switchTitle}>Productivity Tips</div>
              <div style={styles.switchDescription}>
                Tips to improve your productivity
              </div>
            </div>
            <div style={styles.switch(true)}>
              <div style={styles.switchKnob(true)}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Security Settings</div>
      <p style={styles.sectionSubtitle}>
        Manage your account security and privacy
      </p>

      {/* Two-Factor Authentication */}
      <div 
        style={styles.switchContainer}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.switchContainerHover)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.background = styles.switchContainer.background;
        }}
      >
        <div style={styles.switchLeft}>
          <div style={styles.switchIcon}>🔐</div>
          <div style={styles.switchInfo}>
            <div style={styles.switchTitle}>Two-Factor Authentication</div>
            <div style={styles.switchDescription}>
              Add an extra layer of security to your account
            </div>
          </div>
        </div>
        
        <div 
          style={styles.switch(twoFactor)}
          onClick={() => setTwoFactor(!twoFactor)}
        >
          <div style={styles.switchKnob(twoFactor)}></div>
        </div>
      </div>

      {twoFactor && (
        <div style={{ 
          padding: '24px', 
          background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
          borderRadius: '16px',
          marginTop: '16px'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            marginBottom: '12px'
          }}>
            Setup Instructions
          </div>
          <ol style={{ 
            color: darkMode ? '#cbd5e1' : '#475569',
            marginLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>Download Google Authenticator or Authy</li>
            <li>Scan the QR code with your app</li>
            <li>Enter the 6-digit code from the app</li>
          </ol>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <div style={styles.sectionTitle}>Change Password</div>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Enter current password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Enter new password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button style={styles.button('primary')}>
          🔑 Update Password
        </button>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Data Management</div>
      <p style={styles.sectionSubtitle}>
        Manage your data and privacy
      </p>

      {/* Export Data */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Export Your Data</div>
        <p style={{ 
          color: darkMode ? '#94a3b8' : '#64748b',
          marginBottom: '20px'
        }}>
          Download all your tasks, settings, and account data in JSON format.
        </p>
        <button 
          onClick={handleExportData}
          style={styles.button('primary')}
        >
          📥 Export All Data
        </button>
      </div>

      {/* Danger Zone */}
      <div style={styles.dangerZone}>
        <div style={styles.dangerTitle}>
          ⚠️ Danger Zone
        </div>
        <div style={styles.dangerText}>
          These actions are irreversible. Please proceed with caution.
        </div>
        
        <div style={styles.formGrid}>
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#ef4444',
              marginBottom: '8px'
            }}>
              Delete Account
            </div>
            <p style={{ 
              color: darkMode ? '#fca5a5' : '#dc2626',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Permanently delete your account and all data.
            </p>
            <button 
              onClick={handleDeleteAccount}
              style={styles.button('danger')}
            >
              🗑️ Delete Account
            </button>
          </div>

          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              Clear All Data
            </div>
            <p style={{ 
              color: darkMode ? '#fbbf24' : '#d97706',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Remove all tasks and settings, keep account.
            </p>
            <button style={styles.button('warning')}>
              🧹 Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'preferences': return renderPreferencesTab();
      case 'notifications': return renderNotificationsTab();
      case 'security': return renderSecurityTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={styles.mainContainer}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.tabList}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={styles.tab(activeTab === tab.id)}
                onMouseEnter={(e) => activeTab !== tab.id && Object.assign(e.currentTarget.style, styles.tabHover)}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        * {
          transition: all 0.2s ease;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .mainContainer {
            grid-template-columns: 1fr !important;
          }
          
          .sidebar {
            display: flex;
            overflow-x: auto;
            padding: 16px;
          }
          
          .tabList {
            flex-direction: row;
            width: 100%;
          }
          
          .tab {
            white-space: nowrap;
          }
          
          .formGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;