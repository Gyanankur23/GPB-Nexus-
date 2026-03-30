import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import storage from '../../lib/storage';
import auth from '../../lib/auth';

function SidebarItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
        borderRadius: 8, border: 'none', cursor: 'pointer',
        background: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        fontFamily: 'DM Sans, sans-serif', fontWeight: active ? 600 : 400,
        fontSize: '0.875rem', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
      {icon && <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>{icon}</span>}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
}

function OverviewDoc({ roadmap }) {
  return (
    <article className="prose-doc animate-fade-up">
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-light), var(--bg-raised))',
        border: '1px solid var(--border)', borderRadius: 16, padding: '2rem',
        marginBottom: '2.5rem',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="badge badge-accent">{roadmap.category}</span>
          <span className="badge badge-neutral">{roadmap.difficulty}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {roadmap.duration}
          </span>
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{roadmap.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>{roadmap.description}</p>
      </div>

      <h2>What you'll learn</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {roadmap.skills?.map((skill, i) => (
          <span key={i} style={{
            background: 'var(--bg-raised)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '0.35rem 0.75rem',
            color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
          }}>{skill}</span>
        ))}
      </div>

      <h2>Prerequisites</h2>
      <ul>
        {roadmap.prerequisites?.map((p, i) => <li key={i}>{p}</li>)}
      </ul>

      <h2>Roadmap overview</h2>
      <p>This roadmap is split into {roadmap.steps?.length} structured modules, each building on the last. At the end, you'll take a 30-question certification exam and earn a verifiable certificate.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {[
          { label: 'Modules', value: roadmap.steps?.length },
          { label: 'Duration', value: roadmap.duration },
          { label: 'Pass score', value: '70%' },
          { label: 'Certificate', value: 'PDF + JPG' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-raised)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '1rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>{stat.value}</div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ModuleDoc({ step, index }) {
  return (
    <article className="prose-doc animate-fade-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--accent)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Module {index + 1}</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{step.title}</h1>
        </div>
      </div>

      <p>{step.description}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Estimated time: {step.duration}
      </div>

      <h2>Topics covered</h2>
      <ul>{step.topics?.map((t, i) => <li key={i}>{t}</li>)}</ul>

      <h2>Learning resources</h2>
      <p>Use these resources alongside this roadmap. They are free and cover the topics above:</p>
      <ul>{step.resources?.map((r, i) => <li key={i}><code>{r}</code></li>)}</ul>

      <h2>Practice projects</h2>
      <p>Build these projects to solidify your learning. Add them to your GitHub portfolio:</p>
      <ul>{step.projects?.map((p, i) => <li key={i}>{p}</li>)}</ul>

      <div style={{
        background: 'var(--accent-light)', border: '1px solid var(--accent-subtle)',
        borderRadius: 12, padding: '1rem 1.25rem', marginTop: '2rem',
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style={{ color: 'var(--accent)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
          <strong>Pro tip:</strong> Don't just read — build. One hands-on project per topic is worth 10x passive consumption. Aim to finish this module before moving on.
        </p>
      </div>
    </article>
  );
}

export default function RoadmapDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.getCurrentUser());
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    storage.getRoadmap(id).then(data => {
      setRoadmap(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>Loading roadmap…</div>
        </div>
      </>
    );
  }

  if (!roadmap) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem' }}>🗺️</div>
          <div style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>Roadmap not found</div>
          <Link href="/roadmaps" className="btn btn-secondary btn-sm">← Back to roadmaps</Link>
        </div>
      </>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    ...(roadmap.steps || []).map((step, i) => ({ id: `module-${i}`, label: step.title, icon: String(i + 1).padStart(2, '0') })),
  ];

  const currentStep = activeSection.startsWith('module-')
    ? roadmap.steps?.[parseInt(activeSection.split('-')[1])]
    : null;
  const currentStepIndex = activeSection.startsWith('module-')
    ? parseInt(activeSection.split('-')[1])
    : -1;

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: 64, background: 'var(--bg-base)', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            <Link href="/roadmaps" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
            >Roadmaps</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{roadmap.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href={`/quiz/${id}`} className="btn btn-primary btn-sm">
              Take quiz →
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto' }}>
          {/* Sidebar */}
          <aside style={{
            width: 260, flexShrink: 0,
            padding: '1.5rem 1rem',
            borderRight: '1px solid var(--border)',
            minHeight: 'calc(100vh - 120px)',
            position: 'sticky', top: 120, alignSelf: 'flex-start',
          }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
              Content
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {sections.map(s => (
                <SidebarItem
                  key={s.id}
                  label={s.label}
                  icon={s.icon}
                  active={activeSection === s.id}
                  onClick={() => setActiveSection(s.id)}
                />
              ))}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
                Actions
              </div>
              <Link href={`/quiz/${id}`} style={{
                display: 'block', padding: '0.6rem 0.75rem', borderRadius: 8,
                background: 'var(--accent)', color: 'white',
                textDecoration: 'none', textAlign: 'center',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
              >
                📝 Take quiz
              </Link>
              {user && (
                <Link href={`/certification/${id}`} style={{
                  display: 'block', marginTop: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8,
                  background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                  textDecoration: 'none', textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  🏆 My certificate
                </Link>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, padding: '2.5rem 2rem 4rem', minWidth: 0 }}>
            {activeSection === 'overview' && <OverviewDoc roadmap={roadmap} />}
            {currentStep && <ModuleDoc step={currentStep} index={currentStepIndex} />}

            {/* Navigation between sections */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {sections.findIndex(s => s.id === activeSection) > 0 ? (
                <button
                  onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) - 1].id)}
                  className="btn btn-secondary btn-sm"
                >
                  ← Previous
                </button>
              ) : <div />}
              {sections.findIndex(s => s.id === activeSection) < sections.length - 1 ? (
                <button
                  onClick={() => setActiveSection(sections[sections.findIndex(s => s.id === activeSection) + 1].id)}
                  className="btn btn-primary btn-sm"
                >
                  Next →
                </button>
              ) : (
                <Link href={`/quiz/${id}`} className="btn btn-primary btn-sm">
                  Take the quiz →
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
