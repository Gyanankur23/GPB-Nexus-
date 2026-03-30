import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import auth from '../lib/auth';
import { useTheme } from '../lib/theme';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </>
      ) : (
        <>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </>
      )}
    </svg>
  );
}

const navLinks = [
  { href: '/roadmaps', label: 'Roadmaps' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard', auth: true },
];

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    const unsub = auth.onAuthStateChanged(setUser);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          background: scrolled ? 'var(--bg-surface)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.8rem' }}>GN</span>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              GPB Nexus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {navLinks.map(link => {
              if (link.auth && !user) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.5rem', borderRadius: 8 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }} className="hidden-mobile">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--bg-raised)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                    cursor: 'pointer', color: 'var(--text-primary)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--hero-via))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email?.split('@')[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 14, boxShadow: 'var(--shadow-lg)',
                    minWidth: 180, padding: '0.5rem',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Signed in as</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    {[
                      { href: '/dashboard', label: 'Dashboard' },
                      { href: '/profile', label: 'Profile' },
                      { href: '/settings', label: 'Settings' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'block', padding: '0.5rem 0.75rem', borderRadius: 8,
                          color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500,
                          textDecoration: 'none', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'var(--bg-raised)'; e.target.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
                          borderRadius: 8, border: 'none', background: 'transparent',
                          color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'var(--danger-light)'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }} className="hidden-mobile">
                <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/login?signup=true" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-ghost btn-sm show-mobile"
              style={{ padding: '0.5rem', borderRadius: 8 }}
              aria-label="Toggle menu"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--bg-surface)', borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem 1.5rem',
            animation: 'fadeIn 0.2s ease',
          }}>
            {navLinks.map(link => {
              if (link.auth && !user) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '0.6rem 0.75rem', borderRadius: 8,
                    color: isActive(link.href) ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none',
                    background: isActive(link.href) ? 'var(--accent-light)' : 'transparent',
                    marginBottom: 2, transition: 'all 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              {user ? (
                <button onClick={handleLogout} className="btn btn-danger" style={{ flex: 1 }}>Sign out</button>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link href="/login?signup=true" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Get started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx global>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
