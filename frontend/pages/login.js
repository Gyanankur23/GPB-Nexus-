import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import auth from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { signup } = router.query;
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signup === 'true') setIsSignup(true);
    if (auth.isAuthenticated()) router.push('/dashboard');
  }, [signup]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        await auth.register(form.email, form.password, form.name);
      } else {
        await auth.login(form.email, form.password);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 3rem',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.9rem' }}>GN</span>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>GPB Nexus</span>
            </Link>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {isSignup ? 'Start your certification journey today' : 'Sign in to continue your learning'}
            </p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                background: 'var(--danger-light)', border: '1px solid var(--danger)',
                borderRadius: 10, padding: '0.75rem 1rem',
                color: 'var(--danger)', fontSize: '0.875rem',
                marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {isSignup && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Full name</label>
                    <input
                      name="name"
                      type="text"
                      className="input"
                      placeholder="Gyanankur Baruah"
                      value={form.name}
                      onChange={handleChange}
                      required={isSignup}
                      autoComplete="name"
                    />
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Email address</label>
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Password</label>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder={isSignup ? 'Minimum 6 characters' : 'Your password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.8rem', marginTop: '0.25rem', fontSize: '0.95rem' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                      {isSignup ? 'Creating account…' : 'Signing in…'}
                    </span>
                  ) : (
                    isSignup ? 'Create account' : 'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                onClick={() => { setIsSignup(!isSignup); setError(''); setForm({ name: '', email: '', password: '' }); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', padding: 0, fontFamily: 'DM Sans, sans-serif' }}
              >
                {isSignup ? 'Sign in instead' : 'Create one free'}
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.78rem', lineHeight: 1.5 }}>
            By signing up, you agree to our Terms of Service.<br />Your data stays on your device — no server required.
          </p>
        </div>
      </div>
    </>
  );
}
