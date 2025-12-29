import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Menu,
  Plus,
  Star,
  X,
} from 'lucide-react';

import './App.css'; 
import essamProfile from './assets/images/essam-shamim-400x466.webp';

/* --- ROBUST ANIMATION HOOK --- */
const useReveal = (triggerOnce = true, threshold = 0.12) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(currentRef);
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [triggerOnce, threshold]);

  return [ref, isVisible];
};

/* --- REVEAL COMPONENT (Pure JavaScript - No TypeScript) --- */
const Reveal = ({ children, delay = 0, className = '', depth = 'md' }) => {
  const [ref, isVisible] = useReveal();

  const depthMap = {
    sm: 'translateY(14px)',
    md: 'translateY(26px)',
    lg: 'translateY(40px)',
  };

  return (
    <div
      ref={ref}
      className={`reveal-base ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0)' : depthMap[depth] || depthMap.md,
      }}
    >
      {children}
    </div>
  );
};

/* --- NAVIGATION --- */
const Navigation = ({ setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'about', label: 'Philosophy' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'course', label: 'Academy' },
  ];

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out border-b ${scrolled
            ? 'bg-[#FDFBF9]/95 backdrop-blur border-neutral-200 py-4'
            : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="z-50 relative group"
            aria-label="Go to home"
          >
            <span className="font-serif-display text-2xl font-medium tracking-tight group-hover:opacity-70 transition-opacity">
              Essam Shamim.
            </span>
          </button>

          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setCurrentPage('home');
                  scrollToId(l.id);
                }}
                className="text-[11px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors link-underline"
              >
                {l.label}
              </button>
            ))}
            <button className="btn-micro bg-[#1a1a1a] text-white px-6 py-3 text-[11px] uppercase tracking-widest-custom font-bold hover:bg-neutral-800">
              Get Updates
            </button>
          </div>

          <button
            className="md:hidden z-50 btn-micro"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FDFBF9] z-40 transition-transform duration-500 md:hidden flex flex-col justify-center px-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
                setTimeout(() => scrollToId(l.id), 80);
              }}
              className="font-serif-display text-4xl text-left btn-micro"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/* --- EMAIL SUBSCRIPTION FORM (Kit API v3) --- */
const EmailSubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch("/.netlify/functions/kit-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });      

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <p className="text-green-800 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Success! Check your email to confirm your subscription.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-focus flex flex-col sm:flex-row max-w-md border-b border-[#1a1a1a]">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              aria-label="Email Address"
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="bg-transparent w-full py-4 px-2 placeholder:text-neutral-400 font-sans-clean disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-micro whitespace-nowrap px-6 py-4 flex items-center justify-center gap-2 uppercase text-[10px] font-bold tracking-widest-custom hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  Join the list <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Something went wrong. Please try again.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

/* --- SECTIONS --- */

const Hero = () => (
  <section className="min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-center relative overflow-hidden">
    <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 items-end z-10">
      <div className="md:col-span-8">
        <Reveal depth="sm">
          <div className="border-b border-neutral-300 inline-block pb-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-500">
              The Operator's Handbook
            </span>
          </div>
        </Reveal>

        <Reveal delay={90} depth="lg">
          <h1
            className="font-serif-display text-neutral-900 mb-10 -ml-1"
            style={{
              fontSize: 'var(--h1)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            Agency operations,
            <br />
            <span className="italic font-light text-neutral-600">
              demystified.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={180} depth="md">
          <p
            className="font-sans-clean text-neutral-600 max-w-2xl font-light mb-12"
            style={{
              fontSize: 'var(--body-lg)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Actionable systems for founders who are tired of the noise. We
            prioritize clarity, nuance, and sustainability over
            growth-at-all-costs.
          </p>
        </Reveal>

        <Reveal delay={260} depth="sm">
          <EmailSubscriptionForm />

          <div className="mt-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full"></div>
            <span className="text-[10px] uppercase tracking-widest-custom text-neutral-400">
              Read by 2,000+ Real Humans
            </span>
          </div>
        </Reveal>
      </div>

      <div className="md:col-span-4 flex flex-col justify-end md:pl-12 pb-2">
        <div className="border-l border-neutral-200 pl-8 space-y-12">
          {[
            { label: 'Core Focus', value: 'Systems & Logic' },
            { label: 'Format', value: '4-Min Weekly' },
            { label: 'Approach', value: 'Value First' },
          ].map((s, i) => (
            <Reveal key={i} delay={320 + i * 90} depth="sm">
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-[#1a1a1a]">
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest-custom text-neutral-400 mt-2 font-sans-clean">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 hidden md:block">
      <ArrowDown className="w-5 h-5 text-neutral-900" />
    </div>
  </section>
);

/* --- PHILOSOPHY --- */
const PhilosophyManifesto = () => (
  <section
    id="about"
    className="py-24 px-6 md:px-12 bg-[#1a1a1a] text-white border-t border-neutral-800"
  >
    <div className="max-w-4xl mx-auto text-center">
      <Reveal depth="sm">
        <div className="mb-10 flex justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 border border-neutral-700 px-3 py-1 rounded-full bg-neutral-900">
            An Open Letter to Founders
          </span>
        </div>
        <h2
          className="font-serif-display mb-12"
          style={{ fontSize: 'var(--h2)', lineHeight: 'var(--leading-tight)' }}
        >
          "I don't believe in hacks.
          <br />I believe in{' '}
          <span className="italic text-neutral-400 glow-text">
            infrastructure.
          </span>
          "
        </h2>
      </Reveal>

      <Reveal delay={180} depth="md">
        <div
          className="space-y-6 font-sans-clean text-neutral-400 font-light max-w-2xl mx-auto"
          style={{
            fontSize: 'var(--body-lg)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          <p>
            The agency world is drowning in noise. Everyone promises a "secret
            mechanism" to scale. But the truth is boring:{' '}
            <span className="text-white font-medium">
              Scale comes from reliable, repetitive systems.
            </span>
          </p>
          <p>
            The solopreneur doesn't ask: "How can I make more money?" They ask:
            "What kind of life do I want to lead?" and then build a business
            that supports that life.
          </p>
          <p>It's not about getting more. It's about finding enough.</p>
        </div>
        <div className="mt-12 flex justify-center">
          <img
            src="/api/placeholder/150/60"
            alt="Signature"
            className="opacity-60 h-10 invert"
          />
        </div>
      </Reveal>
    </div>
  </section>
);

/* --- ABOUT & CAPABILITIES --- */
const AboutAndCapabilities = () => {
  const [active, setActive] = useState(null);

  const capabilities = [
    {
      id: '01',
      title: 'The Weekly Briefing',
      role: 'Newsletter',
      desc: 'Actionable steps on mechanics and GTM engineering.',
    },
    {
      id: '02',
      title: 'Strategic Advisory',
      role: 'Consulting',
      desc: 'Non-Exec Director roles for $1M to $5M agencies.',
    },
    {
      id: '03',
      title: 'UmbrellaGTM',
      role: 'Systems',
      desc: 'Done-For-You outbound engines and infrastructure.',
    },
    {
      id: '04',
      title: 'Workshops',
      role: 'Education',
      desc: 'Deep dives into scaling service businesses.',
    },
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-24">
        {/* Sticky Left Column */}
        <div className="md:col-span-5 relative">
          <div className="sticky-col">
            <Reveal depth="md">
              <div className="relative mb-8 group">
                <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden transition-all duration-700 rounded-[var(--radius-xl)]">
                <img 
                    src={essamProfile} 
                    alt="Essam Shamim" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 border-l-2 border-white pl-4">
                    <span className="text-white text-xs font-bold uppercase tracking-widest-custom block">
                      The Operator
                    </span>
                  </div>
                </div>

                <div className="absolute -right-4 top-12 bg-white border border-neutral-200 p-4 shadow-xl rotate-3 hidden md:block rounded-[14px]">
                  <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                    Est.
                  </span>
                  <span className="block font-serif-display text-xl">2018</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest-custom text-neutral-400 mb-1">
                    Base
                  </span>
                  <span className="block text-sm font-medium text-neutral-900">
                    Lahore, PK
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest-custom text-neutral-400 mb-1">
                    Focus
                  </span>
                  <span className="block text-sm font-medium text-neutral-900">
                    Systems Architecture
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 flex flex-col gap-24 pt-8 md:pt-0">
          <Reveal delay={140} depth="md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-6 block flex items-center gap-2">
                <span className="w-2 h-2 bg-neutral-900 rounded-full"></span>
                About Me
              </span>
              <h3
                className="font-serif-display mb-8 text-[#1a1a1a]"
                style={{
                  fontSize: 'var(--h3)',
                  lineHeight: 'var(--leading-tight)',
                }}
              >
                From operator to architect.
              </h3>
              <div
                className="space-y-6 text-neutral-600 font-light"
                style={{
                  fontSize: 'var(--body-lg)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                <p>
                  I am an operator first. I've served as a Non-Executive
                  Director for multiple seven-figure firms, not by posting
                  motivational quotes, but by fixing their unit economics,
                  automating their fulfillment, and engineering their exit.
                </p>
                <p>
                  My work is designed for founders who are tired of being the
                  bottleneck. We build assets, not jobs.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-neutral-200 pt-20">
            <Reveal depth="sm">
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-10 block flex items-center gap-2">
                <span className="w-2 h-2 border border-neutral-900 rounded-full"></span>
                Three ways I can help
              </span>
            </Reveal>

            <div className="flex flex-col">
              {capabilities.map((item, i) => (
                <Reveal key={i} delay={i * 90} depth="sm">
                  <div
                    className="group border-b border-neutral-200 py-10 cursor-pointer hover:bg-neutral-50 transition-colors px-4 -mx-4"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-neutral-400 w-6">
                          0{i + 1}
                        </span>
                        <div>
                          <h3
                            className={`font-serif-display text-3xl transition-colors duration-300 ${active === i
                                ? 'text-[#1a1a1a]'
                                : 'text-neutral-500'
                              }`}
                          >
                            {item.title}
                          </h3>
                          <span className="text-[10px] uppercase tracking-widest-custom text-neutral-400 mt-2 block group-hover:text-neutral-600 transition-colors">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-300 ${active === i
                            ? 'rotate-45 text-neutral-900'
                            : 'text-neutral-300'
                          }`}
                      >
                        <ArrowUpRight size={24} />
                      </div>
                    </div>

                    <div
                      className={`pl-12 transition-all duration-400 ease-out ${active === i
                          ? 'opacity-100 translate-y-0 mt-6'
                          : 'opacity-0 -translate-y-2 pointer-events-none mt-6'
                        }`}
                    >
                      <p className="text-base text-neutral-600 font-light max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustpilotSection = () => {
  const reviews = [
    {
      title: 'Finally, a real operator.',
      body: "Essam's systems turned our creative chaos into a predictable machine. We finally have a business, not just a job.",
      author: 'Michael T.',
      role: 'Founder, ScaleAgency',
    },
    {
      title: 'No fluff, just engineering.',
      body: "The only consultant who actually understands the operational reality of 7-figure shops. His 'boring' systems saved us.",
      author: 'Sarah Jenkins',
      role: 'CEO, GrowthPartners',
    },
    {
      title: 'ROI within 30 days.',
      body: 'We stopped bleeding profit within 30 days of implementing his framework. Absolutely essential for agency owners.',
      author: 'David Chen',
      role: 'Director, Elevate Digital',
    },
    {
      title: 'Saved my team 15hrs/week.',
      body: "I was skeptical about 'automation' but the reporting suite Essam built pays for itself ten times over.",
      author: 'Elena R.',
      role: 'COO, Apex Media',
    },
    {
      title: 'Clear and ruthless.',
      body: "Finally, someone who doesn't speak in 'guru' riddles. Clear, actionable, and ruthlessly effective strategies.",
      author: 'James West',
      role: 'Founder, West & Co.',
    },
    {
      title: '$40k MRR added.',
      body: 'The GTM system we built together added $40k MRR in Q4 alone. The ROI is undeniable.',
      author: 'Marcus L.',
      role: 'Head of Growth, Veltra',
    },
  ];

  return (
    <section id="reviews" className="py-32 px-6 md:px-12 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto">
        <Reveal depth="sm">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-8 h-8 fill-[#00b67a] text-[#00b67a]" />
              <span className="text-2xl font-bold">Trustpilot</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 tp-star-bg flex items-center justify-center rounded-[6px]"
                  >
                    <Star className="w-4 h-4 tp-star-fill" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-bold">TrustScore 4.9</div>
                <div className="text-xs text-neutral-500">
                  Based on 40+ Reviews
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 45} depth="sm">
              <div className="bg-white p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col rounded-[var(--radius-xl)]">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className="w-4 h-4 tp-star-bg flex items-center justify-center rounded-[4px]"
                    >
                      <Star className="w-2.5 h-2.5 tp-star-fill" />
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-md mb-2">{r.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-8 flex-grow">
                  "{r.body}"
                </p>
                <div className="pt-6 border-t border-neutral-100">
                  <span className="block text-xs font-bold uppercase tracking-widest-custom">
                    {r.author}
                  </span>
                  <span className="block text-[10px] text-neutral-400 mt-1">
                    {r.role}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CourseSection = () => (
  <section
    id="course"
    className="py-32 px-6 md:px-12 bg-[#0a0a0a] text-[#FDFBF9] relative overflow-hidden"
  >
    <div className="max-w-7xl mx-auto relative z-10">
      <Reveal depth="sm">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-500 mb-4 block">
              The Academy
            </span>
            <h2
              className="font-serif-display"
              style={{
                fontSize: 'var(--h2)',
                lineHeight: 'var(--leading-tight)',
              }}
            >
              Agency AI{' '}
              <span className="italic text-neutral-600">Systems.</span>
            </h2>
          </div>
          <p className="text-neutral-400 max-w-sm text-right text-sm leading-relaxed">
            Centralize operations and acquisition using AI. Moving from
            "founder-led chaos" to "machine-driven order".
          </p>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 border-t border-neutral-800">
        {[
          { t: 'Lead Enrichment', d: 'Stop manual research. Use Clay and AI.' },
          { t: 'Reporting Suite', d: 'Client updates that write themselves.' },
          { t: 'Ops Redundancy', d: 'Systems that allow you to step away.' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 130} depth="sm">
            <div className="p-10 border-r border-neutral-800 border-b md:border-b-0 hover:bg-[#111] transition-colors h-full group">
              <span className="text-xs font-mono text-neutral-600 mb-6 block">
                0{i + 1}
              </span>
              <h3 className="font-serif-display text-2xl mb-4 group-hover:text-white transition-colors">
                {item.t}
              </h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed">
                {item.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const LatestWriting = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/.netlify/functions/beehiiv-feed");
        const data = await res.json();

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (e) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  };

  const posts = items.map((item) => ({
    cat: item.category || "Journal",
    title: item.title || "",
    date: formatDate(item.date),
    link: item.link || "#",
  }));

  return (
    <section className="py-32 px-6 md:px-12 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal depth="sm">
          <div className="flex justify-between items-end mb-20">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-4 block">
                Journal
              </span>
              <h2
                className="font-serif-display text-neutral-900"
                style={{
                  fontSize: "var(--h2)",
                  lineHeight: "var(--leading-tight)",
                }}
              >
                Thinking.
              </h2>
            </div>

            <button
              onClick={() => window.open("https://essam-newsletter.beehiiv.com/", "_blank")}
              className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest-custom font-bold hover:text-neutral-600 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5 btn-micro"
            >
              Read all entries <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="text-neutral-500 text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-neutral-500 text-sm">
            No posts yet. Add a post in Beehiiv and it will show here.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {posts.map((article, i) => (
              <Reveal key={i} delay={i * 90} depth="sm">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[4/3] bg-neutral-100 mb-8 overflow-hidden relative rounded-[var(--radius-xl)]">
                    <div className="absolute inset-0 bg-[#F5F5F0] group-hover:bg-[#EAEAE5] transition-colors duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 font-serif-display text-9xl text-neutral-900 select-none group-hover:opacity-20 transition-opacity">
                      {i + 1}
                    </div>
                    <div className="absolute top-6 left-6 text-[9px] bg-white border border-neutral-200 px-3 py-1 uppercase tracking-widest-custom font-bold shadow-sm rounded-full">
                      {article.cat}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start border-b border-neutral-200 pb-6 group-hover:border-neutral-900 transition-colors duration-500">
                    <h3 className="text-2xl font-serif-display group-hover:text-neutral-600 transition-colors duration-300 pr-4 leading-tight mb-4">
                      {article.title}
                    </h3>
                    <div className="w-full flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                        {article.date}
                      </span>
                      <Plus className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:rotate-90 transition-all duration-300" />
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = () => {
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState('idle');

  const handleFooterSubmit = async (e) => {
    e.preventDefault();

    if (!footerEmail || !footerEmail.includes('@')) {
      setFooterStatus('error');
      return;
    }

    setFooterStatus('loading');

    try {
      const response = await fetch("/.netlify/functions/kit-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: footerEmail }),
      });      

      if (response.ok) {
        setFooterStatus('success');
        setFooterEmail('');
      } else {
        setFooterStatus('error');
      }
    } catch (err) {
      console.error(err);
      setFooterStatus('error');
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-5">
            <h2 className="font-serif-display text-5xl mb-8">
              Ready to <span className="italic text-neutral-500">Scale?</span>
            </h2>
            <p className="text-neutral-400 max-w-md font-light leading-relaxed mb-8">
              Stop playing the "busy founder" game. Let's build a machine that
              runs without you.
            </p>

            {footerStatus === 'success' ? (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-[14px] max-w-md">
                <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Success! Check your email to confirm.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFooterSubmit}>
                <div className="input-focus flex w-full max-w-md bg-white/5 border border-white/10 p-1 rounded-[14px]">
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => {
                      setFooterEmail(e.target.value);
                      if (footerStatus === 'error') setFooterStatus('idle');
                    }}
                    placeholder="Email Address"
                    className="bg-transparent w-full px-4 text-sm text-white placeholder:text-white/40"
                    aria-label="Email address"
                    disabled={footerStatus === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={footerStatus === 'loading'}
                    className="btn-micro bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest-custom hover:bg-neutral-200 rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {footerStatus === 'loading' ? '...' : 'Join'}
                  </button>
                </div>
                {footerStatus === 'error' && (
                  <p className="mt-2 text-red-400 text-xs">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>

          <div className="md:col-span-1"></div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">
              Sitemap
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors link-underline">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Academy</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Journal</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">
              Connect
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors link-underline">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Twitter / X</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Email</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors link-underline">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors link-underline">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest-custom text-neutral-500">
          <span>© 2025 UmbrellaGTM</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full"></div>
            <span>All Systems Operational</span>
          </div>
          <span>Lahore • Global</span>
        </div>
      </div>
    </footer>
  );
};


export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {/* <GlobalStyles /> */}
      <div className="grain-overlay" />
      <Navigation setCurrentPage={setCurrentPage} />

      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <PhilosophyManifesto />
            <AboutAndCapabilities />
            <TrustpilotSection />
            <CourseSection />
            <LatestWriting />
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="font-serif-display text-4xl">Under Construction</h1>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}