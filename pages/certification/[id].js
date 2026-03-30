import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import storage from '../../lib/storage';
import auth from '../../lib/auth';
import { ensureData } from '../../utils/seedData';

function pad(n) { return String(n).padStart(2, '0'); }

function VerificationCode({ cert }) {
  const raw = `${cert.userId}-${cert.roadmapId}-${new Date(cert.issuedAt).getFullYear()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = ((hash << 5) - hash) + raw.charCodeAt(i);
  const code = 'GPB-' + Math.abs(hash).toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
  return code;
}

function CertificatePreview({ cert, roadmapTitle, codeStr, forRef }) {
  const date = cert?.issuedAt ? new Date(cert.issuedAt) : new Date();
  const dateStr = `${pad(date.getDate())} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

  return (
    <div
      ref={forRef}
      style={{
        width: 900, minHeight: 636,
        background: 'linear-gradient(135deg, #0f0c29, #1a1a4e, #302b63)',
        borderRadius: 24,
        padding: '60px 72px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Georgia, serif',
        color: 'white',
        boxSizing: 'border-box',
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', filter: 'blur(50px)' }} />
      {/* Gold border */}
      <div style={{ position: 'absolute', inset: 16, border: '1.5px solid rgba(251,191,36,0.35)', borderRadius: 16, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 20, border: '0.5px solid rgba(251,191,36,0.15)', borderRadius: 14, pointerEvents: 'none' }} />

      {/* Corner ornaments */}
      {[{ top: 24, left: 24 }, { top: 24, right: 24 }, { bottom: 24, left: 24 }, { bottom: 24, right: 24 }].map((style, i) => (
        <div key={i} style={{ position: 'absolute', ...style, width: 20, height: 20, border: '1.5px solid rgba(251,191,36,0.5)', borderRadius: 3 }} />
      ))}

      {/* Logo + issuer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(99,102,241,1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 14 }}>GN</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.95)' }}>GPB Nexus</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Certification Authority</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Verification Code</div>
          <div style={{ fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 700, color: 'rgba(251,191,36,0.8)', letterSpacing: '0.08em' }}>{codeStr}</div>
        </div>
      </div>

      {/* Certificate label */}
      <div style={{ marginBottom: 12, position: 'relative' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(251,191,36,0.7)', marginBottom: 6 }}>
          Certificate of Achievement
        </div>
        <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, rgba(251,191,36,0.8), transparent)', borderRadius: 1 }} />
      </div>

      {/* This certifies */}
      <div style={{ marginBottom: 8, fontFamily: 'Georgia, serif', fontSize: 15, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>
        This is to certify that
      </div>

      {/* Name */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 700,
          color: 'white', lineHeight: 1.1,
          textShadow: '0 0 40px rgba(99,102,241,0.5)',
          letterSpacing: '-0.01em',
        }}>
          {cert?.userName || 'Learner'}
        </div>
        <div style={{ marginTop: 8, width: 200, height: 1, background: 'linear-gradient(90deg, rgba(251,191,36,0.6), transparent)' }} />
      </div>

      {/* Body text */}
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 8, fontStyle: 'italic' }}>
        has successfully completed the certification exam for
      </div>

      {/* Course */}
      <div style={{
        marginBottom: 40,
        fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 22,
        color: 'rgba(165,180,252,1)',
        letterSpacing: '-0.01em', lineHeight: 1.3,
      }}>
        {roadmapTitle}
      </div>

      {/* Score + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
        <div>
          {cert?.score && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Final Score  </span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 16, color: 'rgba(52,211,153,1)' }}>{cert.score}%</span>
            </div>
          )}
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Issued on</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{dateStr}</div>
        </div>

        {/* Seal */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: '2px solid rgba(251,191,36,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(251,191,36,0.08)',
          }}>
            <div style={{ fontSize: 28 }}>🏆</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 7, color: 'rgba(251,191,36,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Certified</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cert, setCert] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    const cur = auth.getCurrentUser();
    setUser(cur);
    if (cur) setNameInput(cur.name || cur.email?.split('@')[0] || '');
    const unsub = auth.onAuthStateChanged(u => { setUser(u); if (u) setNameInput(u.name || u.email?.split('@')[0] || ''); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    ensureData().then(async () => {
      const [r, u] = await Promise.all([storage.getRoadmap(id), Promise.resolve(auth.getCurrentUser())]);
      setRoadmap(r);
      if (u) {
        const c = await storage.getCertificate(u.id, id);
        setCert(c);
      }
      setLoading(false);
    });
  }, [id]);

  const codeStr = cert ? VerificationCode({ cert }) : 'GPB-XXXXXXXX';
  const displayCert = cert ? { ...cert, userName: nameConfirmed ? nameInput : cert.userName } : null;

  const downloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pw / canvas.width * 4, ph / canvas.height * 4);
      const iw = canvas.width * ratio / 4;
      const ih = canvas.height * ratio / 4;
      pdf.addImage(imgData, 'PNG', (pw - iw) / 2, (ph - ih) / 2, iw, ih);
      pdf.save(`GPB_Nexus_${(roadmap?.title || 'Certificate').replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (e) { console.error(e); alert('Download failed. Please try again.'); }
    setDownloading(false);
  };

  const downloadJPG = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certRef.current, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#0f0c29', logging: false });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `GPB_Nexus_${(roadmap?.title || 'Certificate').replace(/\s+/g, '_')}_Certificate.jpg`;
      link.click();
    } catch (e) { console.error(e); alert('Download failed. Please try again.'); }
    setDownloading(false);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>🔐</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Sign in to view your certificate</h2>
          <Link href="/login" className="btn btn-primary">Sign in</Link>
        </div>
      </>
    );
  }

  if (!cert) {
    return (
      <>
        <Navigation />
        <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', color: 'var(--text-primary)' }}>No certificate yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>You haven't passed the <strong>{roadmap?.title}</strong> quiz yet. Score 70%+ to earn your certificate.</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href={`/quiz/${id}`} className="btn btn-primary">Take the quiz →</Link>
            <Link href={`/roadmap/${id}`} className="btn btn-secondary">Study roadmap</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-base)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-up">
            <div className="section-label">Achievement Unlocked</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Your Certificate
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              You scored <strong style={{ color: 'var(--success)' }}>{cert.score}%</strong> on the {roadmap?.title} exam.
            </p>
          </div>

          {/* Name customization */}
          {!nameConfirmed && (
            <div className="card animate-fade-up" style={{ maxWidth: 500, margin: '0 auto 2rem', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Name on certificate
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                This will appear on your downloaded certificate. Make sure it matches your resume.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="input"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="Full Name"
                  style={{ flex: 1 }}
                />
                <button onClick={() => nameInput.trim() && setNameConfirmed(true)} className="btn btn-primary btn-sm" disabled={!nameInput.trim()}>
                  Confirm
                </button>
              </div>
            </div>
          )}

          {nameConfirmed && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <button onClick={() => setNameConfirmed(false)} className="btn btn-ghost btn-sm">✏️ Edit name</button>
            </div>
          )}

          {/* Certificate preview */}
          <div className="animate-fade-up" style={{ marginBottom: '2rem', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <CertificatePreview
                  cert={nameConfirmed ? { ...cert, userName: nameInput } : cert}
                  roadmapTitle={roadmap?.title}
                  codeStr={codeStr}
                  forRef={certRef}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="animate-fade-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={downloadPDF}
              disabled={downloading || !nameConfirmed}
              className="btn btn-primary btn-lg"
              style={{ minWidth: 180 }}
            >
              {downloading ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Generating…</span> : '📄 Download PDF'}
            </button>
            <button
              onClick={downloadJPG}
              disabled={downloading || !nameConfirmed}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: 180 }}
            >
              {downloading ? 'Generating…' : '🖼️ Download JPG'}
            </button>
          </div>

          {!nameConfirmed && (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Confirm your name above to enable download.
            </p>
          )}

          {/* Share row */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigator.clipboard.writeText(`I just earned the ${roadmap?.title} certificate from GPB Nexus! Verification: ${codeStr} — https://gpbnexus.in`)}
              className="btn btn-ghost btn-sm"
            >
              📋 Copy share text
            </button>
          </div>

          {/* Verification */}
          <div className="card" style={{ maxWidth: 480, margin: '2rem auto 0', padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🔒</span>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Verification code</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.4rem' }}>{codeStr}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Employers can verify this certificate using the code above at gpbnexus.in/verify</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to dashboard</Link>
          </div>
        </div>
      </div>
    </>
  );
}
