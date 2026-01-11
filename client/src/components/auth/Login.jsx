import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [cardHovered, setCardHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [demoBoxHovered, setDemoBoxHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState({ forgotPassword: false, register: false });
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Enhanced Styles with Glassmorphism
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },

    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none'
    },

    shape: (size, top, left, rotate, color) => ({
      position: 'absolute',
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${color}, transparent)`,
      borderRadius: '30%',
      top: top,
      left: left,
      transform: `rotate(${rotate}deg)`,
      opacity: 0.1,
      animation: 'float 20s infinite ease-in-out alternate'
    }),

    card: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '32px',
      padding: '56px 48px',
      width: '100%',
      maxWidth: '480px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      zIndex: 2,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: cardHovered ? 'translateY(-8px)' : 'translateY(0)'
    },

    cardHover: {
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
    },

    glowEffect: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle at center, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: -1
    },

    logoContainer: {
      width: '100px',
      height: '100px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
      borderRadius: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 32px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
      transform: logoHovered ? 'perspective(1000px) rotateY(15deg) scale(1.05)' : 'perspective(1000px) rotateY(0deg)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    },

    logoIcon: {
      fontSize: '48px',
      background: 'linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.8))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
    },

    title: {
      fontSize: '42px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.9))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px',
      textAlign: 'center',
      letterSpacing: '-0.5px'
    },

    subtitle: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: '48px',
      fontWeight: '500',
      lineHeight: '1.6'
    },

    formGroup: {
      marginBottom: '32px',
      position: 'relative'
    },

    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '12px',
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease'
    },

    inputContainer: {
      position: 'relative'
    },

    inputIcon: {
      position: 'absolute',
      left: '22px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '22px',
      opacity: 0.7,
      transition: 'all 0.3s ease'
    },

    input: (field, isFocused) => {
      const hasError = errors[field];
      const isHovered = hoveredField === field;
      
      return {
        width: '100%',
        padding: '22px 24px 22px 64px',
        border: `2px solid ${
          hasError ? 'rgba(239, 68, 68, 0.5)' :
          isFocused ? 'rgba(255, 255, 255, 0.3)' :
          'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: '500',
        background: hasError ? 'rgba(239, 68, 68, 0.05)' : 
                   isFocused ? 'rgba(255, 255, 255, 0.08)' : 
                   'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        backdropFilter: 'blur(10px)',
        transform: isHovered || isFocused ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isFocused ? 
          '0 0 0 4px rgba(255, 255, 255, 0.1), inset 0 2px 8px rgba(255, 255, 255, 0.1)' : 
          'none',
        cursor: isSubmitting ? 'not-allowed' : 'text',
        opacity: isSubmitting ? 0.7 : 1
      };
    },

    errorText: {
      color: '#fca5a5',
      fontSize: '14px',
      marginTop: '10px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: 0,
      animation: 'fadeIn 0.3s ease forwards'
    },

    button: {
      width: '100%',
      padding: '24px 36px',
      background: buttonHovered && !isSubmitting ? 
        'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))' : 
        'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '16px',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      transform: buttonHovered && !isSubmitting ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: buttonHovered && !isSubmitting ? '0 20px 40px rgba(0, 0, 0, 0.2)' : 'none'
    },

    buttonRipple: (x, y, size) => ({
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none',
      left: x + 'px',
      top: y + 'px',
      width: size + 'px',
      height: size + 'px'
    }),

    demoBox: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      marginTop: '36px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      transform: demoBoxHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: demoBoxHovered ? '0 10px 30px rgba(0, 0, 0, 0.2)' : 'none'
    },

    demoText: {
      fontSize: '15px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.8))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },

    linkContainer: {
      textAlign: 'center',
      marginTop: '36px',
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.7)'
    },

    link: {
      color: '#fff',
      fontWeight: '700',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      marginLeft: '8px',
      position: 'relative',
      paddingBottom: '4px'
    },

    linkUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #fff, transparent)',
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease'
    },

    footer: {
      textAlign: 'center',
      marginTop: '48px',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontWeight: '500'
    },

    forgotPasswordLink: (isHovered) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      position: 'relative',
      paddingBottom: '2px'
    }),

    registerLink: (isHovered) => ({
      color: '#fff',
      fontWeight: '700',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      marginLeft: '8px',
      position: 'relative',
      paddingBottom: '4px'
    })
  };

  // State for input focus
  const [focusedField, setFocusedField] = useState(null);
  // State for ripple effect
  const [ripple, setRipple] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => {
        setRipple(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, general: result.error }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (e) => {
    if (!isSubmitting) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      setRipple({ x, y, size });
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating Background Shapes */}
      <div style={styles.floatingShapes}>
        <div style={styles.shape('300px', '10%', '5%', 45, '#667eea')}></div>
        <div style={styles.shape('200px', '70%', '80%', 120, '#764ba2')}></div>
        <div style={styles.shape('150px', '20%', '85%', 200, '#fff')}></div>
        <div style={styles.shape('250px', '60%', '10%', 300, '#4f46e5')}></div>
      </div>

      <div 
        style={{
          ...styles.card,
          ...(cardHovered ? styles.cardHover : {})
        }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        {/* Glow Effect */}
        <div style={styles.glowEffect}></div>

        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div 
            style={styles.logoContainer}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <span style={styles.logoIcon}>🔐</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue your journey</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '36px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontWeight: '600',
            fontSize: '15px',
            backdropFilter: 'blur(10px)',
            animation: 'slideDown 0.3s ease'
          }}>
            <span style={{ fontSize: '22px' }}>⚠️</span>
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
          {/* Email Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>📧</div>
              <input
                type="email"
                name="email"
                required
                style={styles.input('email', focusedField === 'email')}
                onFocus={() => {
                  setFocusedField('email');
                  setHoveredField('email');
                }}
                onBlur={() => {
                  setFocusedField(null);
                  if (hoveredField === 'email') setHoveredField(null);
                }}
                onMouseEnter={() => setHoveredField('email')}
                onMouseLeave={() => {
                  if (focusedField !== 'email' && hoveredField === 'email') setHoveredField(null);
                }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p style={styles.errorText}>
                <span>❌</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={styles.label}>Password</label>
              <Link 
                to="/forgot-password" 
                style={styles.forgotPasswordLink(linkHovered.forgotPassword)}
                onMouseEnter={() => setLinkHovered(prev => ({ ...prev, forgotPassword: true }))}
                onMouseLeave={() => setLinkHovered(prev => ({ ...prev, forgotPassword: false }))}
              >
                Forgot password?
                <span className="underline" style={{
                  ...styles.linkUnderline,
                  transform: linkHovered.forgotPassword ? 'scaleX(1)' : 'scaleX(0)'
                }}></span>
              </Link>
            </div>
            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>🔒</div>
              <input
                type="password"
                name="password"
                required
                style={styles.input('password', focusedField === 'password')}
                onFocus={() => {
                  setFocusedField('password');
                  setHoveredField('password');
                }}
                onBlur={() => {
                  setFocusedField(null);
                  if (hoveredField === 'password') setHoveredField(null);
                }}
                onMouseEnter={() => setHoveredField('password')}
                onMouseLeave={() => {
                  if (focusedField !== 'password' && hoveredField === 'password') setHoveredField(null);
                }}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p style={styles.errorText}>
                <span>❌</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
            onMouseEnter={() => !isSubmitting && setButtonHovered(true)}
            onMouseLeave={() => !isSubmitting && setButtonHovered(false)}
            onClick={handleButtonClick}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width: '22px',
                  height: '22px',
                  border: '3px solid transparent',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '14px'
                }}></span>
                Signing in...
              </>
            ) : (
              <>
                <span style={{ fontSize: '22px' }}>🚀</span>
                Sign In
              </>
            )}
            {ripple && (
              <span style={styles.buttonRipple(ripple.x, ripple.y, ripple.size)}></span>
            )}
          </button>
        </form>

        {/* Demo Account */}
        <div 
          style={styles.demoBox}
          onMouseEnter={() => setDemoBoxHovered(true)}
          onMouseLeave={() => setDemoBoxHovered(false)}
        >
          <p style={styles.demoText}>
            <strong>Demo Account:</strong> demo@taskflow.com / demopassword
          </p>
        </div>

        {/* Register Link */}
        <div style={styles.linkContainer}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={styles.registerLink(linkHovered.register)}
            onMouseEnter={() => setLinkHovered(prev => ({ ...prev, register: true }))}
            onMouseLeave={() => setLinkHovered(prev => ({ ...prev, register: false }))}
          >
            Sign up now
            <span className="underline" style={{
              ...styles.linkUnderline,
              transform: linkHovered.register ? 'scaleX(1)' : 'scaleX(0)'
            }}></span>
          </Link>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        /* Enhanced focus styles */
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .card {
            padding: 40px 24px;
            margin: 0 16px;
          }
          
          .title {
            font-size: 32px;
          }
          
          .subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;