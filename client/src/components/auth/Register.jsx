import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [animateStrength, setAnimateStrength] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Modern Gradient Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },

    animatedBackground: {
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      pointerEvents: 'none'
    },

    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '32px',
      padding: '56px 48px',
      width: '100%',
      maxWidth: '520px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: `
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05)
      `,
      animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      zIndex: 2
    },

    logoContainer: {
      width: '100px',
      height: '100px',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
      borderRadius: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 32px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 15px 35px rgba(139, 92, 246, 0.2)',
      animation: 'pulse 2s infinite'
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

    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },

    formGroup: {
      marginBottom: '28px',
      position: 'relative'
    },

    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '12px',
      letterSpacing: '0.3px',
      textTransform: 'uppercase'
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

    input: {
      width: '100%',
      padding: '22px 24px 22px 64px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '500',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backdropFilter: 'blur(10px)'
    },

    inputFocus: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: `
        0 0 0 4px rgba(255, 255, 255, 0.1),
        inset 0 2px 8px rgba(255, 255, 255, 0.1)
      `,
      transform: 'translateY(-2px)'
    },

    strengthMeter: {
      marginTop: '20px'
    },

    strengthLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },

    strengthLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.7)'
    },

    strengthValue: {
      fontSize: '14px',
      fontWeight: '700',
      color: (strength) => {
        if (strength <= 2) return '#f87171';
        if (strength === 3) return '#fbbf24';
        return '#34d399';
      }
    },

    strengthBarContainer: {
      height: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '20px'
    },

    strengthBar: (strength, animate) => ({
      height: '100%',
      width: `${(strength / 5) * 100}%`,
      background: strength <= 2 ? 'linear-gradient(90deg, #f87171, #ef4444)' :
                strength === 3 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                'linear-gradient(90deg, #34d399, #10b981)',
      borderRadius: '4px',
      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: animate ? 'pulseBar 1.5s infinite' : 'none'
    }),

    requirementsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginTop: '16px'
    },

    requirement: (met) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: met ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      border: `1px solid ${met ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
      borderRadius: '12px',
      color: met ? '#34d399' : 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
      fontWeight: met ? '600' : '500',
      transition: 'all 0.3s ease',
      animation: met ? 'requirementMet 0.3s ease' : 'none'
    }),

    requirementIcon: (met) => ({
      fontSize: '18px',
      animation: met ? 'bounce 0.5s ease' : 'none'
    }),

    button: {
      width: '100%',
      padding: '24px 36px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '32px',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },

    buttonHover: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))',
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },

    termsBox: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      marginTop: '36px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)'
    },

    termsText: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: '1.6',
      margin: 0
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
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check password strength with animation
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return strength;
    };
    
    const newStrength = calculateStrength(formData.password);
    setPasswordStrength(newStrength);
    
    // Trigger animation when strength increases
    if (newStrength > 0) {
      setAnimateStrength(true);
      const timer = setTimeout(() => setAnimateStrength(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
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

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: '8+ characters', met: formData.password.length >= 8 },
    { text: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Number', met: /[0-9]/.test(formData.password) },
    { text: 'Special character', met: /[^A-Za-z0-9]/.test(formData.password) },
    { text: 'Strong password', met: passwordStrength >= 4 }
  ];

  return (
    <div style={styles.container}>
      {/* Animated Gradient Background */}
      <div style={styles.animatedBackground}></div>

      <div 
        style={styles.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = `
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = styles.card.boxShadow;
        }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>✨</span>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join thousands of users managing their tasks efficiently</p>
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
          <div style={styles.formGrid}>
            {/* Name Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>👤</span> Full Name
              </label>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  name="name"
                  required
                  style={{
                    ...styles.input,
                    ...(errors.name ? { borderColor: 'rgba(239, 68, 68, 0.5)' } : {}),
                    ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                  }}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p style={{ color: '#fca5a5', fontSize: '14px', marginTop: '8px' }}>
                  <span style={{ marginRight: '6px' }}>❌</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span>📧</span> Email
              </label>
              <div style={styles.inputContainer}>
                <input
                  type="email"
                  name="email"
                  required
                  style={{
                    ...styles.input,
                    ...(errors.email ? { borderColor: 'rgba(239, 68, 68, 0.5)' } : {}),
                    ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                  }}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#fca5a5', fontSize: '14px', marginTop: '8px' }}>
                  <span style={{ marginRight: '6px' }}>❌</span> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span>🔒</span> Password
            </label>
            <div style={styles.inputContainer}>
              <input
                type="password"
                name="password"
                required
                minLength="6"
                style={{
                  ...styles.input,
                  ...(errors.password ? { borderColor: 'rgba(239, 68, 68, 0.5)' } : {}),
                  ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div style={styles.strengthMeter}>
                <div style={styles.strengthLabels}>
                  <span style={styles.strengthLabel}>Password Strength</span>
                  <span style={styles.strengthValue(passwordStrength)}>
                    {passwordStrength}/5
                  </span>
                </div>
                <div style={styles.strengthBarContainer}>
                  <div style={styles.strengthBar(passwordStrength, animateStrength)}></div>
                </div>

                {/* Requirements Grid */}
                <div style={styles.requirementsGrid}>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} style={styles.requirement(req.met)}>
                      <span style={styles.requirementIcon(req.met)}>
                        {req.met ? '✅' : '○'}
                      </span>
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && (
              <p style={{ color: '#fca5a5', fontSize: '14px', marginTop: '8px' }}>
                <span style={{ marginRight: '6px' }}>❌</span> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span>🔒</span> Confirm Password
            </label>
            <div style={styles.inputContainer}>
              <input
                type="password"
                name="confirmPassword"
                required
                style={{
                  ...styles.input,
                  ...(errors.confirmPassword ? { borderColor: 'rgba(239, 68, 68, 0.5)' } : {}),
                  ...(isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                }}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p style={{ color: '#fca5a5', fontSize: '14px', marginTop: '8px' }}>
                <span style={{ marginRight: '6px' }}>❌</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
            onMouseEnter={(e) => !isSubmitting && Object.assign(e.currentTarget.style, styles.buttonHover)}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
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
                Creating Account...
              </>
            ) : (
              <>
                <span style={{ fontSize: '22px' }}>🚀</span>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <div style={styles.termsBox}>
          <p style={styles.termsText}>
            By creating an account, you agree to our <strong style={{ color: '#fff' }}>Terms of Service</strong> and{' '}
            <strong style={{ color: '#fff' }}>Privacy Policy</strong>.
          </p>
        </div>

        {/* Login Link */}
        <div style={styles.linkContainer}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.querySelector('.underline').style.transform = 'scaleX(1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#fff';
              e.target.querySelector('.underline').style.transform = 'scaleX(0)';
            }}
          >
            Sign in here
            <span className="underline" style={styles.linkUnderline}></span>
          </Link>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes pulseBar {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes requirementMet {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
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
          
          .formGrid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .requirementsGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;