import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import auth from '../lib/auth';
import storage from '../lib/storage';
import { ensureData } from '../utils/seedData';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ attempts: 0, passed: 0, certs: 0 });

  useEffect(() => {
    const cur = auth.getCurrentUser();
    if (!cur) { router.push('/login'); return; }
    setUser(cur);
    setForm({ name: cur.name || '' });
    const unsub = auth.onAuthStateChanged(u => { if (!u) router.push('/login'); else { setUser(u); setForm({ name: u.name || '' }); } });
    ensureData().then(async () => {
      const [att, certs] = await Promise.all([storage.getQuizAttempts(cur.id), storage.getUserCertificates(cur.id)]);
      setStats({ attempts: att.length, passed: att.filter(a => a.passed).length, certs: certs.length });
    });
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await auth.updateProfile({ name: form.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="animate-fade-up" style={{ marginBottom: '2.5rem' }}>
            <div className="section-label">Account</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--text-primary)' }}>Your Profile</h1>
          </div>

          {/* Avatar card */}
          <div className="card animate-fade-up delay-100" style={{ padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent), var(--hero-via))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem',
            }}>
              {(user.name || user.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.name || 'Learner'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { v: stats.attempts, l: 'Attempts', icon: '📝' },
              { v: stats.passed, l: 'Passed', icon: '✅' },
              { v: stats.certs, l: 'Certificates', icon: '🏆' },
            ].map(s => (
              <div key={s.l} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{s.v}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Edit form */}
          <div className="card animate-fade-up delay-300" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Edit Profile</h2>
            {error && <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
            {saved && <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.875rem', marginBottom: '1rem' }}>✅ Profile updated!</div>}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Display name</label>
                <input className="input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Email address</label>
                <input className="input" type="email" value={user.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.35rem' }}>Email cannot be changed.</div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>

          {/* Danger zone */}
          <div className="card animate-fade-up delay-400" style={{ padding: '1.5rem', border: '1px solid var(--danger-light)' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>Danger zone</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Sign out from all sessions or clear your local data. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => auth.logout().then(() => router.push('/'))} className="btn btn-danger btn-sm">Sign out</button>
              <button
                onClick={() => {
                  if (confirm('This will delete all your quiz attempts, certificates, and account data from this device. Continue?')) {
                    ['gpb_user', 'gpb_users', 'gpb_attempts', 'gpb_certificates', 'gpb_roadmaps', 'gpb_quizzes'].forEach(k => localStorage.removeItem(k));
                    auth.logout().then(() => router.push('/'));
                  }
                }}
                className="btn btn-sm"
                style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
              >
                Delete all data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
