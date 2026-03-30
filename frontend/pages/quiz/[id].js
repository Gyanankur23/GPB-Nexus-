import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import storage from '../../lib/storage';
import auth from '../../lib/auth';
import { ensureData } from '../../utils/seedData';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ProgressCircle({ pct }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--bg-overlay)" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke="var(--accent)" strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fontSize="10" fontFamily="DM Mono, monospace" fontWeight="600" fill="var(--text-primary)">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;

  const [phase, setPhase] = useState('loading'); // loading | intro | quiz | result
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [previousBest, setPreviousBest] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setUser(auth.getCurrentUser());
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    ensureData().then(async () => {
      const [q, r] = await Promise.all([storage.getQuiz(id), storage.getRoadmap(id)]);
      setQuiz(q);
      setRoadmap(r);
      if (q) setTimeLeft(q.duration * 60);
      setPhase(q ? 'intro' : 'error');
    });
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    storage.getBestAttempt(user.id, id).then(setPreviousBest);
  }, [user, id]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitQuiz(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const startQuiz = () => {
    const q = shuffle(quiz.questions).slice(0, 30);
    setQuestions(q);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(quiz.duration * 60);
    setPhase('quiz');
  };

  const selectAnswer = (opt) => {
    setAnswers(a => ({ ...a, [current]: opt }));
  };

  const submitQuiz = async () => {
    clearInterval(timerRef.current);
    const qs = questions;
    let correct = 0;
    qs.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    const score = Math.round((correct / qs.length) * 100);
    const passed = score >= 70;

    const attempt = { userId: user?.id || 'guest', roadmapId: id, roadmapTitle: roadmap?.title, score, passed, correct, total: qs.length, answers };
    let savedAttempt = attempt;
    if (user) savedAttempt = await storage.addQuizAttempt(attempt);

    if (passed && user) {
      await storage.saveCertificate({
        userId: user.id,
        roadmapId: id,
        roadmapTitle: roadmap?.title,
        score,
        userName: user.name || user.email,
      });
    }

    setResult({ score, passed, correct, total: qs.length });
    setPhase('result');
  };

  const answeredCount = Object.keys(answers).length;
  const timeWarning = timeLeft < 120 && timeLeft > 0;

  if (phase === 'loading') {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>Loading quiz…</div>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'error') {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem' }}>❌</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Quiz not available</h2>
          <Link href="/roadmaps" className="btn btn-secondary">← Back to roadmaps</Link>
        </div>
      </>
    );
  }

  if (phase === 'intro') {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
          <div className="card animate-fade-up" style={{ maxWidth: 580, width: '100%', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📝</div>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Certification Exam</div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{quiz.title}</h1>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { label: 'Questions', value: '30', icon: '❓' },
                { label: 'Time limit', value: `${quiz.duration} min`, icon: '⏱️' },
                { label: 'Pass score', value: '70%', icon: '🎯' },
                { label: 'Certificate', value: 'PDF + JPG', icon: '🏆' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {previousBest && (
              <div style={{ background: previousBest.passed ? 'var(--success-light)' : 'var(--warning-light)', border: `1px solid ${previousBest.passed ? 'var(--success)' : 'var(--warning)'}`, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: previousBest.passed ? 'var(--success)' : 'var(--warning)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>{previousBest.passed ? '✅' : '📊'}</span>
                <span>Your best score: <strong>{previousBest.score}%</strong> {previousBest.passed ? '— You passed! Retake to improve.' : '— Keep going, you need 70% to pass.'}</span>
              </div>
            )}

            {!user && (
              <div style={{ background: 'var(--warning-light)', border: '1px solid var(--warning)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--warning)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>⚠️</span>
                <span>You're not signed in. Your results won't be saved. <Link href="/login" style={{ color: 'var(--warning)', fontWeight: 600 }}>Sign in</Link> to earn a certificate.</span>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Rules</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {['30 randomized questions from our full question bank', 'Each question has one correct answer', 'You can navigate between questions freely', 'Timer counts down — submit before it runs out', 'Score 70% or above to earn your certificate'].map(r => (
                  <li key={r} style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>›</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href={`/roadmap/${id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Study first</Link>
              <button onClick={startQuiz} className="btn btn-primary" style={{ flex: 2 }}>
                Start exam →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'quiz') {
    const q = questions[current];
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)' }}>
          {/* Quiz header bar */}
          <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Question {current + 1} / {questions.length}
            </div>
            <div style={{ flex: 1, maxWidth: 300 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${((answeredCount) / questions.length) * 100}%` }} />
              </div>
            </div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: '1rem',
              color: timeWarning ? 'var(--danger)' : 'var(--text-primary)',
              background: timeWarning ? 'var(--danger-light)' : 'var(--bg-raised)',
              border: `1px solid ${timeWarning ? 'var(--danger)' : 'var(--border)'}`,
              padding: '0.35rem 0.85rem', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.3s',
            }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>
            {/* Question */}
            <div className="card animate-fade-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Question {current + 1}
              </div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--text-primary)', lineHeight: 1.45, margin: 0 }}>
                {q.question}
              </h2>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {q.options.map((opt, i) => {
                const selected = answers[current] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(opt)}
                    className={`quiz-option${selected ? ' selected' : ''}`}
                    style={{ textAlign: 'left' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        background: selected ? 'var(--accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{ lineHeight: 1.5 }}>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} className="btn btn-secondary" disabled={current === 0}>← Previous</button>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', fontWeight: 600,
                      background: i === current ? 'var(--accent)' : answers[i] !== undefined ? 'var(--accent-light)' : 'var(--bg-raised)',
                      color: i === current ? 'white' : answers[i] !== undefined ? 'var(--accent)' : 'var(--text-tertiary)',
                      border: i === current ? 'none' : `1px solid ${answers[i] !== undefined ? 'var(--accent-subtle)' : 'var(--border)'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent(c => c + 1)} className="btn btn-primary">Next →</button>
              ) : (
                <button
                  onClick={submitQuiz}
                  className="btn btn-primary"
                  style={{ background: 'var(--success)', boxShadow: '0 2px 12px rgba(5,150,105,0.35)' }}
                >
                  Submit ({answeredCount}/{questions.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'result') {
    const { score, passed, correct, total } = result;
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
          <div className="card animate-fade-up" style={{ maxWidth: 540, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {passed ? 'You passed!' : 'Not quite there yet'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {passed ? 'Excellent work. Your certificate is ready to download.' : `You scored ${score}%. Score 70% or above to earn your certificate.`}
              </p>
            </div>

            {/* Score ring */}
            <div style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-overlay)" strokeWidth="10" />
                <circle
                  cx="70" cy="70" r="60" fill="none"
                  stroke={passed ? 'var(--success)' : 'var(--danger)'}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 - (score / 100) * 2 * Math.PI * 60}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <text x="70" y="62" textAnchor="middle" fontSize="28" fontFamily="Syne, sans-serif" fontWeight="800" fill={passed ? 'var(--success)' : 'var(--danger)'}>{score}%</text>
                <text x="70" y="84" textAnchor="middle" fontSize="12" fontFamily="DM Sans, sans-serif" fill="var(--text-tertiary)">{correct}/{total} correct</text>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { label: 'Score', value: score + '%', ok: passed },
                { label: 'Correct', value: correct, ok: true },
                { label: 'Incorrect', value: total - correct, ok: false },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem 0.5rem' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: s.label === 'Score' ? (passed ? 'var(--success)' : 'var(--danger)') : 'var(--text-primary)' }}>{s.value}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              {passed && user && (
                <Link href={`/certification/${id}`} className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                  🏆 Download Certificate
                </Link>
              )}
              {!passed && (
                <button onClick={() => { setPhase('intro'); setResult(null); }} className="btn btn-primary" style={{ width: '100%' }}>
                  Retake quiz
                </button>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href={`/roadmap/${id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Review roadmap</Link>
                <Link href="/dashboard" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
