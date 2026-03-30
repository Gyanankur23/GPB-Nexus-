import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import auth from '../lib/auth';
import { ensureData } from '../utils/seedData';

function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
}

function StatCard({ value, suffix, label, started }) {
  const count = useCountUp(value, 1800, started);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'white', lineHeight: 1, marginBottom: '0.35rem' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 400 }}>{label}</div>
    </div>
  );
}

const roadmapHighlights = [
  { id: 'tcs-fullstack', title: 'TCS Full Stack', cat: 'Development', time: '12–16 wks', color: '#3b82f6' },
  { id: 'infosys-data-science', title: 'Infosys Data Science', cat: 'Data & AI', time: '10–14 wks', color: '#8b5cf6' },
  { id: 'wipro-cloud', title: 'Wipro Cloud Architect', cat: 'Cloud & DevOps', time: '8–12 wks', color: '#06b6d4' },
  { id: 'hcl-ml', title: 'HCL Machine Learning', cat: 'Data & AI', time: '14–18 wks', color: '#f59e0b' },
  { id: 'cognizant-testing', title: 'Cognizant QA Engineer', cat: 'Testing', time: '6–8 wks', color: '#10b981' },
  { id: 'accenture-pm', title: 'Accenture Consulting', cat: 'Management', time: '8–10 wks', color: '#ef4444' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    ensureData().catch(console.error);
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navigation />
      <main>
        {/* ─── HERO ─── */}
        <section style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #701a75 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 1.5rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Mesh dots */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          {/* Glow blobs */}
          <div aria-hidden style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(129,140,248,0.15)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', bottom: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(236,72,153,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 760 }}>
            <div className="animate-fade-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 9999, padding: '0.35rem 1rem',
              color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 500,
              marginBottom: '1.75rem', backdropFilter: 'blur(8px)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', flexShrink: 0 }} />
              India's career certification platform · 50,000+ learners
            </div>

            <h1 className="animate-fade-up delay-100" style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              color: 'white', marginBottom: '1.5rem',
              lineHeight: 1.1, letterSpacing: '-0.03em',
            }}>
              Your roadmap to<br/>
              <span style={{ background: 'linear-gradient(90deg, #a5b4fc, #f0abfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                India's top tech jobs
              </span>
            </h1>

            <p className="animate-fade-up delay-200" style={{
              fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}>
              Structured roadmaps for TCS, Infosys, Wipro & more. Take real skill quizzes and earn downloadable certificates recognized by recruiters.
            </p>

            <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {user ? (
                <>
                  <Link href="/dashboard" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'white', color: '#4f46e5',
                    padding: '0.85rem 2rem', borderRadius: 14,
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
                  >
                    Go to Dashboard
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                  <Link href="/roadmaps" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.1)', color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '0.85rem 2rem', borderRadius: 14,
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                    textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  >
                    Explore Roadmaps
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login?signup=true" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'white', color: '#4f46e5',
                    padding: '0.85rem 2rem', borderRadius: 14,
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
                  >
                    Get certified free
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                  <Link href="/roadmaps" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.1)', color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '0.85rem 2rem', borderRadius: 14,
                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                    textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  >
                    Browse roadmaps
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up delay-400" style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Accenture'].map(co => (
                <span key={co} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{co}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section ref={statsRef} style={{ background: 'var(--accent)', padding: '3.5rem 1.5rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
            <StatCard value={50000} suffix="+" label="Learners certified" started={statsStarted} />
            <StatCard value={15} suffix="+" label="Career roadmaps" started={statsStarted} />
            <StatCard value={95} suffix="%" label="Quiz pass rate" started={statsStarted} />
            <StatCard value={125000} suffix="+" label="Certificates issued" started={statsStarted} />
          </div>
        </section>

        {/* ─── ROADMAPS PREVIEW ─── */}
        <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-base)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="section-label">Roadmaps</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Structured paths to your dream job
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>
                Each roadmap is curated for specific Indian tech company roles — with weekly milestones, resources, and a final certification exam.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {roadmapHighlights.map((r, i) => (
                <Link key={r.id} href={`/roadmap/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="card animate-fade-up"
                    style={{ padding: '1.5rem', animationDelay: `${i * 0.07}s`, cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: r.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: r.color }} />
                      </div>
                      <span className="badge badge-neutral">{r.cat}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{r.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {r.time}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/roadmaps" className="btn btn-secondary btn-lg">View all roadmaps →</Link>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="section-label">Process</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--text-primary)' }}>
                From zero to certified in 4 steps
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '2rem' }}>
              {[
                { num: '01', title: 'Pick a roadmap', desc: 'Choose the company and role you\'re targeting from our curated list.' },
                { num: '02', title: 'Study the docs', desc: 'Follow structured module-by-module learning with resources and projects.' },
                { num: '03', title: 'Take the quiz', desc: '30-question timed exam with real interview-style questions. Score 70%+ to pass.' },
                { num: '04', title: 'Download certificate', desc: 'Get your PDF or JPG certificate with a unique verification code.' },
              ].map((step, i) => (
                <div key={step.num} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 500, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{step.num}</div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{
          padding: '5rem 1.5rem',
          background: 'linear-gradient(135deg, var(--hero-from), var(--hero-via))',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Start your career journey today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
            Free to get started. Earn your first certificate in as little as 2 weeks.
          </p>
          {!user && (
            <Link href="/login?signup=true" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'white', color: '#4f46e5',
              padding: '1rem 2.5rem', borderRadius: 16,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1rem',
              textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Create free account →
            </Link>
          )}
        </section>
      </main>
    </>
  );
}
