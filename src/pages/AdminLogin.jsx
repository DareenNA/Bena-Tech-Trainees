import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin/dashboard', { replace: true });
      }
    });

    gsap.fromTo('.reveal-up', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
    );
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setResetSent(true);
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-color)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Light */}
      <div className="ambient-light"></div>

      <div className="reveal-up" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-bento)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        backdropFilter: 'blur(20px)',
        webkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="display-2 text-orange" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Bena Tech</h2>
          <p style={{ color: 'var(--text-grey)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isResetMode ? 'Reset Password' : 'Admin Portal'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(231, 73, 4, 0.1)',
            border: '1px solid var(--primary-orange)',
            borderRadius: '12px',
            padding: '1rem',
            color: 'var(--text-white)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {isResetMode ? (
          resetSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'var(--text-white)',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                A reset link has been sent to your email address. Please check your inbox.
              </div>
              <button 
                onClick={() => {
                  setIsResetMode(false);
                  setResetSent(false);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '1.2rem' }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bena-tech.com" 
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-white)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-orange)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary" 
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  marginTop: '1rem',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError(null);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '1.2rem' }}
              >
                Back to Sign In
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@bena-tech.com" 
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-white)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-orange)';
                  e.target.style.boxShadow = '0 0 10px rgba(231, 73, 4, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsResetMode(true);
                    setError(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-orange)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text-white)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-orange)';
                  e.target.style.boxShadow = '0 0 10px rgba(231, 73, 4, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{
                width: '100%',
                padding: '1.2rem',
                marginTop: '1rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
