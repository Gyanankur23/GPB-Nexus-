import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import storage from '../lib/storage';
import auth from '../lib/auth';
import { ensureData } from '../utils/seedData';

const CARD_ACCENTS = {
  'tcs-fullstack': '#3b82f6',
  'infosys-data-science': '#8b5cf6',
  'wipro-cloud': '#06b6d4',
  'hcl-machine-learning': '#f59e0b',
  'cognizant-testing': '#10b981',
  'accenture-consulting': '#ef4444',
};

function StatCard({ value, label, icon, accent = 'var(--accent)' }) {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cur = auth.getCurrentUser();
    if (!cur) { router.push('/login'); return; }
    setUser(cur);
    const unsub = auth.onAuthStateChanged(u => { if (!u) router.push('/login'); else setUser(u); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    ensureData().then(async () => {
      const [rm, att, certs] = await Promise.all([
        storage.getAllRoadmaps(),
        storage.getQuizAttempts(user.id),
        storage.getUserCertificates(user.id),
      ]);
      setRoadmaps(rm);
      setAttempts(att);
      setCertificates(certs);
      setLoading(false);
    });
  }, [user]);

  if (loading || !user) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </>
    );
  }

  const passedAttempts = attempts.filter(a => a.passed);
  const certCount = certificates.length;
  const attemptedIds = [...new Set(attempts.map(a => a.roadmapId))];
  const uniqueAttempted = attemptedIds.length;

  // Get best score per roadmap
  const bestByRoadmap = {};
  attempts.forEach(a => {
    if (!bestByRoadmap[a.roadmapId] || a.score > bestByRoadmap[a.roadmapId].score) {
      bestByRoadmap[a.roadmapId] = a;
    }
  });

  // Recent activity — last 5 attempts sorted newest first
  const recentAttempts = [...attempts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
          {/* Welcome */}
          <div className="animate-fade-up" style={{ marginBottom: '2.5rem' }}>
            <div className="section-label">Dashboard</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Welcome back, {user.name || user.email?.split('@')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your progress, view certificates, and continue learning.</p>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <StatCard value={uniqueAttempted} label="Roadmaps started" icon="🗺️" accent="#4f46e5" />
            <StatCard value={attempts.length} label="Total quiz attempts" icon="📝" accent="#0ea5e9" />
            <StatCard value={passedAttempts.length} label="Quizzes passed" icon="✅" accent="#059669" />
            <StatCard value={certCount} label="Certificates earned" icon="🏆" accent="#f59e0b" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Certificates */}
            <div className="animate-fade-up delay-200">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Your Certificates</h2>
              </div>
              {certCount === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No certificates yet</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Pass any quiz with 70%+ to earn a certificate.</div>
                  <Link href="/roadmaps" className="btn btn-primary btn-sm">Explore roadmaps →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {certificates.map(c => {
                    const accent = CARD_ACCENTS[c.roadmapId] || '#4f46e5';
                    return (
                      <div key={c.id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏆</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.roadmapTitle}</div>
                          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                            Score: <span style={{ color: 'var(--success)', fontWeight: 600 }}>{c.score}%</span> · {new Date(c.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <Link href={`/certification/${c.roadmapId}`} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>View →</Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="animate-fade-up delay-300">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Recent Activity</h2>
              </div>
              {recentAttempts.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No quiz attempts yet</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Take your first quiz to see activity here.</div>
                  <Link href="/roadmaps" className="btn btn-primary btn-sm">Start a quiz →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {recentAttempts.map(a => (
                    <div key={a.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.passed ? '✅' : '❌'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.roadmapTitle || a.roadmapId}</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · Score: <span style={{ color: a.passed ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{a.score}%</span>
                        </div>
                      </div>
                      <Link href={`/quiz/${a.roadmapId}`} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>Retake</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Roadmaps Progress */}
          <div className="animate-fade-up delay-400" style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>All Roadmaps</h2>
              <Link href="/roadmaps" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {roadmaps.map(r => {
                const best = bestByRoadmap[r.id];
                const hasCert = certificates.some(c => c.roadmapId === r.id);
                const accent = CARD_ACCENTS[r.id] || '#4f46e5';
                return (
                  <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: accent }} />
                      </div>
                      {hasCert && <span className="badge badge-success">🏆 Certified</span>}
                      {!hasCert && best && <span className="badge badge-warning">{best.score}%</span>}
                      {!best && <span className="badge badge-neutral">Not started</span>}
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{r.title}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/roadmap/${r.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '0.78rem' }}>Study</Link>
                      <Link href={`/quiz/${r.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '0.78rem' }}>Quiz</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
