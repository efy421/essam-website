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

/* --- REVEAL COMPONENT --- */
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
    { id: 'journal', label: 'Journal' }, // Added Journal here
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
  const [status, setStatus] = useState('idle');

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
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="bg-transparent w-full py-4 px-2 placeholder:text-neutral-400 font-sans-clean disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-micro whitespace-nowrap px-6 py-4 flex items-center justify-center gap-2 uppercase text-[10px] font-bold tracking-widest-custom hover:bg-neutral-100 disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining...' : <>Join the list <ArrowRight size={14} /></>}
            </button>
          </div>
          {status === 'error' && (
             <p className="mt-4 text-red-800 text-sm">Something went wrong. Please try again.</p>
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
          <h1 className="font-serif-display text-neutral-900 mb-10 -ml-1" style={{ fontSize: 'var(--h1)', lineHeight: 'var(--leading-tight)' }}>
            Agency operations,<br />
            <span className="italic font-light text-neutral-600">demystified.</span>
          </h1>
        </Reveal>
        <Reveal delay={180} depth="md">
          <p className="font-sans-clean text-neutral-600 max-w-2xl font-light mb-12" style={{ fontSize: 'var(--body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
            Actionable systems for founders who are tired of the noise. We prioritize clarity, nuance, and sustainability over growth-at-all-costs.
          </p>
        </Reveal>
        <Reveal delay={260} depth="sm">
          <EmailSubscriptionForm />
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full"></div>
            <span className="text-[10px] uppercase tracking-widest-custom text-neutral-400">Read by 2,000+ Real Humans</span>
          </div>
        </Reveal>
      </div>
      <div className="md:col-span-4 flex flex-col justify-end md:pl-12 pb-2">
        <div className="border-l border-neutral-200 pl-8 space-y-12">
          {[{ label: 'Core Focus', value: 'Systems & Logic' }, { label: 'Format', value: '4-Min Weekly' }, { label: 'Approach', value: 'Value First' }].map((s, i) => (
            <Reveal key={i} delay={320 + i * 90} depth="sm">
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-[#1a1a1a]">{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest-custom text-neutral-400 mt-2 font-sans-clean">{s.label}</div>
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

const PhilosophyManifesto = () => (
  <section id="about" className="py-24 px-6 md:px-12 bg-[#1a1a1a] text-white border-t border-neutral-800">
    <div className="max-w-4xl mx-auto text-center">
      <Reveal depth="sm">
        <div className="mb-10 flex justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 border border-neutral-700 px-3 py-1 rounded-full bg-neutral-900">An Open Letter to Founders</span>
        </div>
        <h2 className="font-serif-display mb-12" style={{ fontSize: 'var(--h2)', lineHeight: 'var(--leading-tight)' }}>
          "I don't believe in hacks.<br />I believe in <span className="italic text-neutral-400 glow-text">infrastructure.</span>"
        </h2>
      </Reveal>
      <Reveal delay={180} depth="md">
        <div className="space-y-6 font-sans-clean text-neutral-400 font-light max-w-2xl mx-auto" style={{ fontSize: 'var(--body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
          <p>The agency world is drowning in noise. Scale comes from reliable, repetitive systems.</p>
          <p>It's not about getting more. It's about finding enough.</p>
        </div>
      </Reveal>
    </div>
  </section>
);

const AboutAndCapabilities = () => {
  const [active, setActive] = useState(null);
  const capabilities = [
    { id: '01', title: 'The Weekly Briefing', role: 'Newsletter', desc: 'Actionable steps on mechanics and GTM engineering.' },
    { id: '02', title: 'Strategic Advisory', role: 'Consulting', desc: 'Non-Exec Director roles for $1M to $5M agencies.' },
    { id: '03', title: 'UmbrellaGTM', role: 'Systems', desc: 'Done-For-You outbound engines and infrastructure.' },
    { id: '04', title: 'Workshops', role: 'Education', desc: 'Deep dives into scaling service businesses.' },
  ];
  return (
    <section className="py-32 px-6 md:px-12 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-24">
        <div className="md:col-span-5 relative">
          <div className="sticky-col">
            <Reveal depth="md">
              <div className="relative mb-8 group">
                <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden rounded-2xl">
                  <img src={essamProfile} alt="Essam Shamim" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 border-l-2 border-white pl-4">
                    <span className="text-white text-xs font-bold uppercase tracking-widest-custom block">The Operator</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6">
                <div><span className="block text-[9px] uppercase text-neutral-400">Base</span><span className="block text-sm font-medium">Lahore, PK</span></div>
                <div><span className="block text-[9px] uppercase text-neutral-400">Focus</span><span className="block text-sm font-medium">Systems Architecture</span></div>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="md:col-span-7 flex flex-col gap-24 pt-8 md:pt-0">
          <Reveal delay={140} depth="md">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 mb-6 block flex items-center gap-2"><span className="w-2 h-2 bg-neutral-900 rounded-full"></span>About Me</span>
              <h3 className="font-serif-display mb-8 text-[#1a1a1a]" style={{ fontSize: 'var(--h3)', lineHeight: 'var(--leading-tight)' }}>From operator to architect.</h3>
              <p className="text-neutral-600 font-light" style={{ fontSize: 'var(--body-lg)', lineHeight: 'var(--leading-relaxed)' }}>I am an operator first. We build assets, not jobs.</p>
            </div>
          </Reveal>
          <div className="flex flex-col">
            {capabilities.map((item, i) => (
              <Reveal key={i} delay={i * 90} depth="sm">
                <div className="group border-b border-neutral-200 py-10 cursor-pointer hover:bg-neutral-50 transition-colors px-4 -mx-4" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6"><span className="text-[10px] font-mono text-neutral-400 w-6">0{i+1}</span><div><h3 className={`font-serif-display text-3xl ${active === i ? 'text-black' : 'text-neutral-500'}`}>{item.title}</h3></div></div>
                    <ArrowUpRight className={active === i ? 'text-black' : 'text-neutral-300'} />
                  </div>
                  {active === i && <p className="pl-12 mt-4 text-neutral-600 font-light max-w-lg">{item.desc}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustpilotSection = () => (
  <section id="reviews" className="py-32 px-6 md:px-12 bg-[#F5F5F0]">
    <div className="max-w-7xl mx-auto text-center">
      <Reveal depth="sm"><div className="flex flex-col items-center mb-20"><Star className="w-8 h-8 fill-[#00b67a] text-[#00b67a]" /><span className="text-2xl font-bold">Trustpilot</span><div className="font-bold">TrustScore 4.9</div></div></Reveal>
      <div className="grid md:grid-cols-3 gap-6 text-left">
        {[{ title: 'Finally, a real operator.', author: 'Michael T.' }].map((r, i) => (
          <Reveal key={i} delay={i * 45} depth="sm"><div className="bg-white p-8 border border-neutral-200 rounded-2xl"><h3>{r.title}</h3><span>{r.author}</span></div></Reveal>
        ))}
      </div>
    </div>
  </section>
);

const CourseSection = () => (
  <section id="course" className="py-32 px-6 md:px-12 bg-[#0a0a0a] text-[#FDFBF9]"><div className="max-w-7xl mx-auto"><h2 className="font-serif-display text-5xl">Agency AI Systems.</h2></div></section>
);

/* --- KIT FEED INTEGRATION (REPLACES BEEHIIV) --- */
const LatestWriting = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/.netlify/functions/kit-feed");
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="journal" className="py-32 px-6 md:px-12 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal><div className="flex justify-between items-end mb-20"><div><span className="text-[10px] font-bold uppercase text-neutral-400 mb-4 block">Journal</span><h2 className="font-serif-display text-6xl">Thinking.</h2></div></div></Reveal>
        {loading ? <p>Loading Entries...</p> : (
          <div className="grid md:grid-cols-3 gap-12">
            {items.slice(0, 3).map((article, i) => (
              <a key={i} href={article.link} target="_blank" rel="noreferrer" className="group block border-b border-neutral-200 pb-6 hover:border-neutral-900 transition-colors">
                <h3 className="text-2xl font-serif-display group-hover:text-neutral-600 mb-4">{article.title}</h3>
                <div className="flex justify-between items-center"><span className="text-[10px] text-neutral-400 font-mono uppercase">{article.date}</span><Plus className="w-4 h-4 text-neutral-300" /></div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-800">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-5"><h2 className="font-serif-display text-5xl mb-8">Ready to Scale?</h2><EmailSubscriptionForm /></div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-2"><h4 className="text-xs font-bold uppercase text-neutral-500 mb-8">Sitemap</h4><ul className="space-y-4 text-sm text-neutral-300"><li>Home</li><li>Philosophy</li><li>Reviews</li><li>Academy</li><li>Journal</li></ul></div>
        <div className="md:col-span-2"><h4 className="text-xs font-bold uppercase text-neutral-500 mb-8">Connect</h4><ul className="space-y-4 text-sm text-neutral-300"><li>LinkedIn</li><li>Twitter / X</li><li>Instagram</li><li>Email</li></ul></div>
        <div className="md:col-span-2"><h4 className="text-xs font-bold uppercase text-neutral-500 mb-8">Legal</h4><ul className="space-y-4 text-sm text-neutral-300"><li>Privacy</li><li>Terms</li></ul></div>
      </div>
      <div className="border-t border-white/10 pt-8 flex justify-between items-center text-[10px] uppercase text-neutral-500">
        <span>© 2025 UmbrellaGTM</span>
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full"></div><span>All Systems Operational</span></div>
        <span>Lahore • Global</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  return (
    <>
      <div className="grain-overlay" />
      <Navigation setCurrentPage={setCurrentPage} />
      <main>
        <Hero /><PhilosophyManifesto /><AboutAndCapabilities /><TrustpilotSection /><CourseSection /><LatestWriting />
      </main>
      <Footer />
    </>
  );
}