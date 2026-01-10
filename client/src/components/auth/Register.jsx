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

  /* =========================
     STYLES
     ========================= */
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif"
    },
    card: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      width: '100%',
      maxWidth: '520px',
      color: '#fff'
    },
    title: {
      fontSize: '36px',
      fontWeight: 800,
      textAlign: 'center',
      marginBottom: '12px'
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: '32px',
      opacity: 0.8
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 600
    },
    input: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      outline: 'none',
      fontSize: '16px'
    },
    error: {
      color: '#fca5a5',
      marginTop: '6px',
      fontSize: '14px'
    },
    button: {
      width: '100%',
      padding: '16px',
      borderRadius: '14px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 700,
      cursor: 'pointer',
      marginTop: '16px'
    },

    /* === PASSWORD STRENGTH === */
    strengthMeter: {
      marginTop: '16px'
    },
    strengthLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px'
    },
    strengthLabel: {
      fontSize: '14px',
      opacity: 0.7
    },
    strengthValue: {
      fontSize: '14px',
      fontWeight: 700
    },
    strengthBarContainer: {
      height: '8px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    strengthBar: (strength, animate) => ({
      height: '100%',
      width: `${(strength / 5) * 100}%`,
      background:
        strength <= 2
          ? '#f87171'
          : strength === 3
          ? '#fbbf24'
          : '#34d399',
      transition: 'width 0.4s ease',
      animation: animate ? 'pulse 1.2s infinite' : 'none'
    }),
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '24px',
      color: '#fff',
      fontWeight: 600
    }
  };

  /* =========================
     AUTH REDIRECT
     ========================= */
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  /* =========================
     PASSWORD STRENGTH LOGIC
     ========================= */
  useEffect(() => {
    const calc = (pwd) => {
      let s = 0;
      if (pwd.length >= 6) s++;
      if (pwd.length >= 8) s++;
      if (/[A-Z]/.test(pwd)) s++;
      if (/[0-9]/.test(pwd)) s++;
      if (/[^A-Za-z0-9]/.test(pwd)) s++;
      return s;
    };

    const newStrength = calc(formData.password);
    setPasswordStrength(newStrength);

    if (newStrength > 0) {
      setAnimateStrength(true);
      const t = setTimeout(() => setAnimateStrength(false), 1200);
      return () => clearTimeout(t);
    }
  }, [formData.password]);

  /* =========================
     HANDLERS
     ========================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name) e.name = 'Name required';
    if (!formData.email) e.email = 'Email required';
    if (formData.password.length < 6) e.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (res.success) navigate('/dashboard');
    else setErrors({ general: res.error });

    setIsSubmitting(false);
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start managing tasks smarter</p>

        {errors.general && <p style={styles.error}>{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}

            {formData.password && (
              <div style={styles.strengthMeter}>
                <div style={styles.strengthLabels}>
                  <span style={styles.strengthLabel}>Strength</span>
                  <span
                    style={{
                      ...styles.strengthValue,
                      color:
                        passwordStrength <= 2
                          ? '#f87171'
                          : passwordStrength === 3
                          ? '#fbbf24'
                          : '#34d399'
                    }}
                  >
                    {passwordStrength}/5
                  </span>
                </div>
                <div style={styles.strengthBarContainer}>
                  <div
                    style={styles.strengthBar(
                      passwordStrength,
                      animateStrength
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              style={styles.input}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            style={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <Link to="/login" style={styles.link}>
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
