import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Link from 'next/link';
import storage from '../lib/storage';
import { ensureData } from '../utils/seedData';

const CATEGORIES = [
  { id: 'all', label: 'All roadmaps' },
  { id: 'development', label: 'Development' },
  { id: 'data-ai', label: 'Data & AI' },
  { id: 'cloud-devops', label: 'Cloud & DevOps' },
  { id: 'testing', label: 'Testing' },
  { id: 'consulting', label: 'Consulting' },
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'var(--success-light)', color: 'var(--success)' },
  Intermediate: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  Advanced: { bg: 'var(--warning-light)', color: 'var(--warning)' },
};

const CARD_ACCENTS = {
  'tcs-fullstack': '#3b82f6',
  'infosys-data-science': '#8b5cf6',
  'wipro-cloud': '#06b6d4',
  'hcl-machine-learning': '#f59e0b',
  'cognizant-testing': '#10b981',
  'accenture-consulting': '#ef4444',
};

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureData().then(() => storage.getAllRoadmaps()).then(data => {
      setRoadmaps(data);
      setLoading(false);
    });
  }, []);

  const filtered = roadmaps.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'all' || r.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>
        {/* Header */}
        <section style={{ padding: '3.5rem 1.5rem 2rem', textAlign: 'center' }}>
          <div className="section-label">Roadmaps</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Career roadmaps for India's top tech companies
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>
            Curated, structured learning paths built for TCS, Infosys, Wipro & more. Each comes with a certification exam.
          </p>
        </section>

        {/* Filters */}
        <section style={{ padding: '0 1.5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Search roadmaps, skills…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem', maxWidth: 440 }}
              />
            </div>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    padding: '0.4rem 0.9rem', borderRadius: 9999, border: 'none', cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    background: category === c.id ? 'var(--accent)' : 'var(--bg-surface)',
                    color: category === c.id ? 'white' : 'var(--text-secondary)',
                    border: category === c.id ? 'none' : '1px solid var(--border)',
                    boxShadow: category === c.id ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              Loading roadmaps…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No roadmaps found</div>
              <div>Try adjusting your search or category filter.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((r, i) => {
                const accent = CARD_ACCENTS[r.id] || '#4f46e5';
                const diff = DIFFICULTY_COLORS[r.difficulty] || DIFFICULTY_COLORS.Intermediate;
                return (
                  <Link key={r.id} href={`/roadmap/${r.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="card animate-fade-up"
                      style={{ padding: '1.75rem', animationDelay: `${i * 0.06}s`, height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = accent + '60'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      {/* Top */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accent}30` }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: accent }} />
                        </div>
                        <span style={{ background: diff.bg, color: diff.color, fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {r.difficulty}
                        </span>
                      </div>

                      {/* Title & desc */}
                      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{r.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {r.description}
                      </p>

                      {/* Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                        {(r.skills || []).slice(0, 4).map(s => (
                          <span key={s} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.2rem 0.55rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s}</span>
                        ))}
                        {(r.skills || []).length > 4 && (
                          <span style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.2rem 0.55rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>+{r.skills.length - 4}</span>
                        )}
                      </div>

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.1rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {r.duration}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          {r.steps?.length} modules
                        </div>
                        <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Start →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
