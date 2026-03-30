import { useState } from 'react';
import Navigation from '../components/Navigation';
import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Explorer',
    tagline: 'Get started, no card needed',
    monthly: 0,
    yearly: 0,
    color: '#6b7280',
    features: [
      { text: '3 roadmaps (basic tracks)', included: true },
      { text: '2 quiz attempts / month', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Community access', included: true },
      { text: 'Downloadable certificates', included: false },
      { text: 'All 15+ roadmaps', included: false },
      { text: 'Unlimited quiz attempts', included: false },
      { text: 'Interview prep resources', included: false },
    ],
    cta: 'Start for free',
    ctaHref: '/login?signup=true',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    tagline: 'Everything you need to get hired',
    monthly: 999,
    yearly: 799,
    color: '#4f46e5',
    badge: 'Most popular',
    features: [
      { text: 'All 15+ roadmaps', included: true },
      { text: 'Unlimited quiz attempts', included: true },
      { text: 'Downloadable PDF + JPG certificates', included: true },
      { text: 'Interview prep resources', included: true },
      { text: 'Progress analytics dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team management', included: false },
      { text: 'Custom roadmaps', included: false },
    ],
    cta: 'Start Pro',
    ctaHref: '/login?signup=true&plan=pro',
    highlighted: true,
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For college clubs & bootcamps',
    monthly: 1999,
    yearly: 1499,
    color: '#0ea5e9',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Up to 25 members', included: true },
      { text: 'Team progress dashboard', included: true },
      { text: 'White-label certificates', included: true },
      { text: 'Bulk certificate download', included: true },
      { text: 'Custom roadmaps', included: true },
      { text: 'Dedicated account manager', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Team',
    ctaHref: '/login?signup=true&plan=team',
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For colleges & corporate training',
    monthly: null,
    yearly: null,
    color: '#7c3aed',
    features: [
      { text: 'Everything in Team', included: true },
      { text: 'Unlimited members', included: true },
      { text: 'Custom roadmap creation', included: true },
      { text: 'API access & SSO', included: true },
      { text: 'SLA guarantee (99.9%)', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'On-site training sessions', included: true },
      { text: 'Analytics export', included: true },
    ],
    cta: 'Contact sales',
    ctaHref: 'mailto:sales@gpbnexus.in',
    highlighted: false,
  },
];

const faqs = [
  { q: 'Is the free plan actually free?', a: 'Yes — no credit card required. You get access to 3 roadmaps and 2 quiz attempts per month at no cost, forever.' },
  { q: 'Can I download my certificate?', a: 'Yes! Pro and above plans let you download your certificate as both PDF and JPG. The certificate includes a unique verification code that employers can validate.' },
  { q: 'What happens if I fail the quiz?', a: 'You can retake the quiz as many times as you need (Pro and above get unlimited attempts). Explorer plan gets 2 attempts per month.' },
  { q: 'Do you offer student discounts?', a: 'Yes — students with a valid .edu email get 40% off Pro. Reach out at hello@gpbnexus.in.' },
  { q: 'Are the certificates recognized by companies?', a: 'Our certificates are skills-based and include a verifiable code. They work best as a portfolio addition rather than a formal credential — but they\'re a strong signal in tech hiring.' },
  { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade at any time. Downgrades take effect at the end of the billing cycle.' },
];

function CheckIcon({ color = '#059669', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const isYearly = billing === 'yearly';

  return (
    <>
      <Navigation />
      <main style={{ paddingTop: 80, background: 'var(--bg-base)', minHeight: '100vh' }}>
        {/* Header */}
        <section style={{ textAlign: 'center', padding: '4rem 1.5rem 3rem' }}>
          <div className="section-label">Pricing</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Simple, honest pricing
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Start free. Pay only when you need more. All prices in Indian Rupees (₹).
          </p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 4,
          }}>
            <button
              onClick={() => setBilling('monthly')}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                background: billing === 'monthly' ? 'var(--accent)' : 'transparent',
                color: billing === 'monthly' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                background: billing === 'yearly' ? 'var(--accent)' : 'transparent',
                color: billing === 'yearly' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              Yearly
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 9999 }}>−20%</span>
            </button>
          </div>
        </section>

        {/* Plans grid */}
        <section style={{ padding: '0 1.5rem 5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            {plans.map((plan) => {
              const price = isYearly ? plan.yearly : plan.monthly;
              return (
                <div
                  key={plan.id}
                  className="animate-fade-up"
                  style={{
                    background: plan.highlighted ? plan.color : 'var(--bg-surface)',
                    border: plan.highlighted ? `2px solid ${plan.color}` : '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: plan.highlighted ? `0 20px 60px ${plan.color}30` : 'var(--shadow-sm)',
                    transform: plan.highlighted ? 'scale(1.02)' : 'scale(1)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: plan.color, color: 'white',
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                      padding: '0.3rem 0.9rem', borderRadius: 9999,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: plan.highlighted ? 'rgba(255,255,255,0.8)' : plan.color }} />
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: plan.highlighted ? 'white' : 'var(--text-primary)' }}>
                        {plan.name}
                      </span>
                    </div>
                    <p style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)', fontSize: '0.85rem' }}>{plan.tagline}</p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    {price === null ? (
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: plan.highlighted ? 'white' : 'var(--text-primary)' }}>Custom</div>
                    ) : price === 0 ? (
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: plan.highlighted ? 'white' : 'var(--text-primary)' }}>Free</div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)', fontSize: '1.1rem', fontWeight: 600 }}>₹</span>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.4rem', color: plan.highlighted ? 'white' : 'var(--text-primary)', lineHeight: 1 }}>{price.toLocaleString()}</span>
                        <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)', fontSize: '0.85rem' }}>/mo</span>
                      </div>
                    )}
                    {isYearly && price !== null && price !== 0 && (
                      <div style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        Billed ₹{(price * 12).toLocaleString()} annually
                      </div>
                    )}
                  </div>

                  <a
                    href={plan.ctaHref}
                    style={{
                      display: 'block', textAlign: 'center', textDecoration: 'none',
                      padding: '0.75rem', borderRadius: 12, marginBottom: '1.75rem',
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                      background: plan.highlighted ? 'white' : 'var(--accent)',
                      color: plan.highlighted ? plan.color : 'white',
                      transition: 'all 0.2s',
                      boxShadow: plan.highlighted ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 10px rgba(99,102,241,0.3)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = plan.highlighted ? '0 8px 24px rgba(0,0,0,0.25)' : '0 6px 20px rgba(99,102,241,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = plan.highlighted ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 10px rgba(99,102,241,0.3)'; }}
                  >
                    {plan.cta}
                  </a>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: plan.highlighted ? (f.included ? 'white' : 'rgba(255,255,255,0.45)') : (f.included ? 'var(--text-primary)' : 'var(--text-tertiary)') }}>
                        {f.included
                          ? <CheckIcon color={plan.highlighted ? 'rgba(255,255,255,0.9)' : 'var(--success)'} />
                          : <XIcon />
                        }
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ padding: '4rem 1.5rem 6rem', background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="section-label">FAQ</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: 'var(--text-primary)' }}>Common questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{faq.q}</span>
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {openFaq === i && (
                    <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
