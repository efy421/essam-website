// App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Menu,
  X,
  Star,
  Plus,
  ChevronLeft,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";

import "./App.css";
import essamProfile from "./assets/images/essam-shamim-400x466.webp";

/*
  CUSTOM CMS EXPECTATION

  You said: no Beehiiv, no Kit-hosted articles. Use a custom CMS.
  This App.jsx expects two Netlify Functions (or any API routes) that return JSON:

  1) List posts:
     GET /.netlify/functions/cms-posts
     Response:
     {
       "items": [
         {
           "id": "208",
           "slug": "the-addiction-to-relevance",
           "title": "The addiction to relevance.",
           "date": "2025-12-27T00:00:00.000Z",
           "category": "Mindset",
           "excerpt": "Short summary used on cards and archive list.",
           "readingTime": 4,
           "heroColor": "bg-[#0f172a]" // optional
         }
       ]
     }

  2) Single post:
     GET /.netlify/functions/cms-post?slug=the-addiction-to-relevance
     Response:
     {
       "item": {
         ...same fields...,
         "contentHtml": "<p>Full HTML content</p>"
       }
     }

  If these endpoints are not live yet, the UI still works using fallbackPosts.
*/

/* ---------------------------- REVEAL ANIMATION ---------------------------- */
const useReveal = (triggerOnce = true, threshold = 0.1) => {
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
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [triggerOnce, threshold]);

  return [ref, isVisible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-base ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ---------------------------- CANVAS BACKGROUND ---------------------------- */
const InfrastructureBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];

    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    let mouse = { x: null, y: null };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw() {
        ctx.fillStyle = "#1a1a1a";
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(26, 26, 26, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
};

/* ---------------------------- NAVIGATION ---------------------------- */
const Navigation = ({ currentPage, setCurrentPage, isReading }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "about", label: "Philosophy" },
    { id: "reviews", label: "Reviews" },
    { id: "course", label: "Academy" },
  ];

  const goHome = () => {
    setMobileMenuOpen(false);
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToId = (id) => {
    setMobileMenuOpen(false);
    setCurrentPage("home");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled
            ? "bg-[#FDFBF9]/95 backdrop-blur border-neutral-200 py-3 md:py-4 shadow-sm"
            : "bg-transparent border-transparent py-4 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <button onClick={goHome} className="z-50 relative group" aria-label="Go home">
            <span className="font-serif-display text-xl md:text-2xl font-medium tracking-tight text-[#1a1a1a] transition-opacity">
              Essam Shamim.
            </span>
          </button>

          {(isReading || currentPage === "archive") && (
            <button
              onClick={goHome}
              className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-widest-custom font-bold hover:text-neutral-500 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Home
            </button>
          )}

          <div className="hidden md:flex items-center gap-10">
            {!(isReading || currentPage === "archive") &&
              links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToId(l.id)}
                  className="text-[10px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors"
                >
                  {l.label}
                </button>
              ))}

            <button className="bg-[#1a1a1a] text-white px-6 py-3 text-[10px] uppercase tracking-widest-custom font-bold hover:bg-neutral-800 transition-colors">
              Get Updates
            </button>
          </div>

          <button
            className="md:hidden z-50 p-2"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#1a1a1a]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1a1a1a]" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-[#FDFBF9] z-40 transition-transform duration-500 md:hidden flex flex-col justify-center px-8 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          <button onClick={goHome} className="font-serif-display text-4xl text-left text-[#1a1a1a]">
            Home
          </button>

          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="font-serif-display text-4xl text-left text-[#1a1a1a]"
            >
              {l.label}
            </button>
          ))}

          <button className="bg-[#1a1a1a] text-white w-full py-4 text-xs font-bold uppercase tracking-widest-custom mt-8">
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
};

/* ---------------------------- KIT SUBSCRIBE (WORKING) ---------------------------- */
const EmailSubscriptionForm = ({ variant = "hero" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/.netlify/functions/kit-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`p-4 border rounded-lg max-w-xl ${
          variant === "footer"
            ? "bg-green-500/15 border-green-500/25 text-green-300"
            : "bg-green-50 border-green-200 text-green-800"
        }`}
      >
        <p className="text-sm font-medium flex items-center gap-2">
          <CheckIcon />
          Success! Check your email to confirm your subscription.
        </p>
      </div>
    );
  }

  const isFooter = variant === "footer";

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={
          isFooter
            ? "input-focus flex w-full max-w-md bg-white/5 border border-white/10 p-1 rounded-[14px]"
            : "flex flex-col sm:flex-row w-full max-w-xl gap-2 p-2 bg-white border border-neutral-200 shadow-xl shadow-black/5 hover:shadow-black/10 transition-all duration-500 transform hover:-translate-y-1"
        }
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={isFooter ? "Email Address" : "Enter your email address"}
          aria-label="Email address"
          disabled={status === "loading"}
          className={
            isFooter
              ? "bg-transparent w-full px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
              : "bg-transparent w-full py-4 px-6 focus:outline-none placeholder:text-neutral-400 font-sans-clean text-base"
          }
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className={
            isFooter
              ? "btn-micro bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest-custom hover:bg-neutral-200 rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
              : "whitespace-nowrap bg-[#1a1a1a] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest-custom hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          }
        >
          {status === "loading" ? "Joining..." : isFooter ? "Join" : "Join the List"}
        </button>
      </div>

      {status === "error" && (
        <p className={`mt-2 text-xs ${isFooter ? "text-red-400" : "text-red-600"}`}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

/* ---------------------------- CMS DATA HOOKS ---------------------------- */
const CMS_LIST_URL = "/.netlify/functions/cms-posts";
const CMS_SINGLE_URL = "/.netlify/functions/cms-post";

const fallbackPosts = [
  {
    id: "208",
    slug: "test-post",
    title: "Test Post",
    date: "2025-12-28T14:41:04.000Z",
    category: "Journal",
    excerpt: "Fallback content while CMS endpoints are not connected yet.",
    readingTime: 4,
    heroColor: "bg-[#0f172a]",
    contentHtml:
      "<p>This is fallback HTML content.</p><p>Connect your custom CMS endpoints to load real posts.</p>",
  },
];

const useCmsPosts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(CMS_LIST_URL);
        if (!res.ok) throw new Error("CMS list fetch failed");
        const data = await res.json();
        const list = Array.isArray(data.items) ? data.items : [];
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setItems(fallbackPosts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
};

const fetchCmsPostBySlug = async (slug) => {
  const url = `${CMS_SINGLE_URL}?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CMS single fetch failed");
  const data = await res.json();
  return data.item || null;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
};

/* ---------------------------- SECTIONS ---------------------------- */
const Hero = () => {
  return (
    <section className="min-h-[90vh] pt-32 pb-20 px-6 md:px-12 flex flex-col justify-center items-center text-center relative overflow-hidden z-10">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="border-b border-neutral-300 inline-block pb-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-500">
              The Operator&apos;s Handbook
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-serif-display text-6xl md:text-8xl lg:text-9xl leading-[1] text-[#1a1a1a] mb-10">
            Engineer your <br />
            <span className="italic text-neutral-500">agency.</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="font-sans-clean text-lg md:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light mb-16">
            No growth hacks. No secret sauce. Just the raw infrastructure required to remove yourself from daily chaos.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col items-center gap-8">
            <EmailSubscriptionForm variant="hero" />

            <div className="flex items-center gap-3 mt-2 opacity-70">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-neutral-300 border-2 border-[#FDFBF9]" />
                <div className="w-6 h-6 rounded-full bg-neutral-400 border-2 border-[#FDFBF9]" />
                <div className="w-6 h-6 rounded-full bg-neutral-500 border-2 border-[#FDFBF9]" />
              </div>
              <span className="text-[11px] uppercase tracking-widest-custom text-neutral-500 font-bold">
                Read by 2,000+ founders
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 hidden md:block">
        <ArrowDown className="w-5 h-5 text-neutral-900" />
      </div>
    </section>
  );
};

const PhilosophyManifesto = () => {
  const [ref, isInView] = useReveal(true, 0.2);

  const paragraphs = [
    "You started this agency to buy freedom. But if you are honest, it can feel like a hostage situation.",
    "It’s Monday morning. You open your laptop. Your stomach drops. Three clients want updates. A project is late. Next month’s pipeline looks thin.",
    "So you put on the cape. You hustle. You beg for referrals. You jump into delivery because nobody else does it right.",
    "It works. You survive another month. But that is not a business. That is a high paying job with the worst boss, you.",
    "The gurus tell you to sell more. But adding volume to a broken system does not create profit. It creates collapse.",
    "The problem is not your work ethic. The problem is your infrastructure.",
    "This is not magic. It is engineering. The shift from getting gigs to building assets.",
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-[#CCC5B9] text-[#1a1a1a] relative z-10 min-h-[90vh] flex items-center justify-center">
      <div ref={ref} className="max-w-2xl mx-auto text-left">
        <div className="mb-16 flex justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest-custom text-[#1a1a1a]/60 border border-[#1a1a1a]/20 px-3 py-1 rounded-full">
            The Reality Check
          </span>
        </div>

        <div className="font-serif-display text-xl md:text-2xl leading-[1.8] space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`transition-all duration-700 ease-out transform ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {para}
            </p>
          ))}
        </div>

        <div
          className="mt-20 flex flex-col gap-2 transition-opacity duration-1000"
          style={{ opacity: isInView ? 0.6 : 0 }}
        >
          <span className="font-serif-display italic text-lg">- Essam</span>
        </div>
      </div>
    </section>
  );
};

const AboutAndCapabilities = () => {
  const [active, setActive] = useState(null);

  const capabilities = [
    {
      id: "01",
      title: "The Weekly Briefing",
      role: "Newsletter",
      desc: "One actionable system on agency mechanics every week.",
    },
    {
      id: "02",
      title: "Strategic Advisory",
      role: "Consulting",
      desc: "For agencies hitting the $1M to $5M wall. Fix unit economics and remove founder dependency.",
    },
    {
      id: "03",
      title: "UmbrellaGTM",
      role: "Systems",
      desc: "Outbound engine, infrastructure, and execution. Done for you.",
    },
    {
      id: "04",
      title: "Workshops",
      role: "Education",
      desc: "Deep dives into scaling service businesses for leadership teams.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-[#FDFBF9] border-t border-neutral-200 relative z-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-24">
        <div className="md:col-span-5 relative">
          <div className="sticky-col">
            <Reveal>
              <div className="relative mb-8 group">
                <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden rounded-[var(--radius-xl)]">
                  <img src={essamProfile} alt="Essam Shamim" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 border-l-2 border-white pl-4">
                    <span className="text-white text-xs font-bold uppercase tracking-widest-custom block">The Operator</span>
                  </div>
                </div>

                <div className="absolute -right-4 top-12 bg-white border border-neutral-200 p-4 shadow-xl rotate-3 hidden md:block rounded-[14px]">
                  <span className="block text-[10px] font-mono text-neutral-400 uppercase">Est.</span>
                  <span className="block font-serif-display text-xl">2018</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest-custom text-neutral-400 mb-1">Base</span>
                  <span className="block text-sm font-medium text-neutral-900">Lahore, PK</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest-custom text-neutral-400 mb-1">Focus</span>
                  <span className="block text-sm font-medium text-neutral-900">Systems Architecture</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-24 pt-8 md:pt-0">
          <Reveal delay={200}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-6 block flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1a1a1a] rounded-full" />
                About Me
              </span>
              <h3 className="font-serif-display text-3xl md:text-4xl mb-8 text-[#1a1a1a] leading-tight">
                From operator to architect.
              </h3>
              <div className="space-y-6 text-neutral-600 font-light text-lg leading-relaxed">
                <p>
                  I am not a coach. I am an operator. The job is to remove bottlenecks, fix margins, and build systems that
                  run without founder panic.
                </p>
                <p>We move you from principal to shareholder.</p>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-neutral-200 pt-20">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-10 block flex items-center gap-2">
                <span className="w-2 h-2 border border-neutral-900 rounded-full" />
                Three ways I can help
              </span>
            </Reveal>

            <div className="flex flex-col">
              {capabilities.map((item, i) => (
                <Reveal key={item.id} delay={i * 100}>
                  <div
                    className="group border-b border-neutral-200 py-10 cursor-pointer hover:bg-neutral-50 transition-all px-4 -mx-4"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-neutral-400 w-6">0{i + 1}</span>
                        <div>
                          <h3
                            className={`font-serif-display text-2xl md:text-3xl transition-colors duration-300 ${
                              active === i ? "text-[#1a1a1a]" : "text-neutral-500"
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
                        className={`transform transition-transform duration-300 ${
                          active === i ? "rotate-45 text-neutral-900" : "text-neutral-300"
                        }`}
                      >
                        <ArrowUpRight size={24} />
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        active === i ? "max-h-24 opacity-100 mt-6" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="pl-12 text-sm md:text-base text-neutral-600 font-light max-w-lg">{item.desc}</p>
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
      title: "Finally, a real operator.",
      body: "Essam's systems turned our creative chaos into a predictable machine. We finally have a business, not just a job.",
      author: "Michael T.",
      role: "Founder, ScaleAgency",
    },
    {
      title: "No fluff, just engineering.",
      body: "The only consultant who actually understands the operational reality of 7-figure shops. His boring systems saved us.",
      author: "Sarah Jenkins",
      role: "CEO, GrowthPartners",
    },
    {
      title: "ROI within 30 days.",
      body: "We stopped bleeding profit within 30 days of implementing his framework.",
      author: "David Chen",
      role: "Director, Elevate Digital",
    },
    {
      title: "Saved my team 15hrs/week.",
      body: "The reporting suite Essam built pays for itself ten times over.",
      author: "Elena R.",
      role: "COO, Apex Media",
    },
    {
      title: "Clear and practical.",
      body: "No guru riddles. Clear and actionable strategies.",
      author: "James West",
      role: "Founder, West & Co.",
    },
    {
      title: "$40k MRR added.",
      body: "The GTM system we built together added $40k MRR in Q4 alone.",
      author: "Marcus L.",
      role: "Head of Growth, Veltra",
    },
  ];

  return (
    <section id="reviews" className="py-24 md:py-32 px-6 md:px-12 bg-[#F5F5F0] relative z-10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-8 h-8 fill-[#00b67a] text-[#00b67a]" />
              <span className="text-2xl font-bold">Trustpilot</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-6 h-6 tp-star-bg flex items-center justify-center rounded-[6px]">
                    <Star className="w-4 h-4 tp-star-fill" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-bold">TrustScore 4.9</div>
                <div className="text-xs text-neutral-500">Based on 40+ Reviews</div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="bg-white p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col rounded-[var(--radius-xl)]">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 tp-star-bg flex items-center justify-center rounded-[4px]">
                      <Star className="w-2.5 h-2.5 tp-star-fill" />
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-md mb-2">{r.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-8 flex-grow">"{r.body}"</p>
                <div className="pt-6 border-t border-neutral-100">
                  <span className="block text-xs font-bold uppercase tracking-widest-custom">{r.author}</span>
                  <span className="block text-[10px] text-neutral-400 mt-1">{r.role}</span>
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
  <section id="course" className="py-24 md:py-32 px-6 md:px-12 bg-[#0a0a0a] text-[#FDFBF9] relative overflow-hidden z-10">
    <div className="max-w-7xl mx-auto relative z-10">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-500 mb-4 block">
              The Academy
            </span>
            <h2 className="font-serif-display text-5xl md:text-6xl lg:text-7xl">
              Agency AI <span className="italic text-neutral-600">Systems.</span>
            </h2>
          </div>
          <p className="text-neutral-400 max-w-sm md:text-right text-sm leading-relaxed">
            Centralize operations and acquisition using AI. Move from founder-led chaos to machine-driven order.
          </p>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 border-t border-neutral-800">
        {[
          { t: "Lead Enrichment", d: "Stop manual research. Use AI enrichment." },
          { t: "Reporting Suite", d: "Client updates that write themselves." },
          { t: "Ops Redundancy", d: "Systems that let you step away." },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 150}>
            <div className="p-10 border-r border-neutral-800 border-b md:border-b-0 hover:bg-[#111] transition-colors h-full group">
              <span className="text-xs font-mono text-neutral-600 mb-6 block">0{i + 1}</span>
              <h3 className="font-serif-display text-2xl mb-4 group-hover:text-white transition-colors">{item.t}</h3>
              <p className="text-neutral-500 text-sm font-light leading-relaxed">{item.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------- JOURNAL: HOME CARDS ---------------------------- */
const JournalSection = ({ onRead, onViewAll }) => {
  const { items, loading } = useCmsPosts();

  const top3 = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.slice(0, 3);
  }, [items]);

  return (
    <section id="journal" className="py-24 md:py-32 px-6 md:px-12 border-t border-neutral-200 bg-white relative z-10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-4 block">
                Journal
              </span>
              <h2 className="font-serif-display text-5xl md:text-6xl text-[#1a1a1a]">Thinking.</h2>
            </div>

            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest-custom font-bold hover:text-neutral-600 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5"
            >
              Read all entries <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="text-neutral-500 text-sm">Loading...</div>
        ) : top3.length === 0 ? (
          <div className="text-neutral-500 text-sm">No posts yet. Add posts in your CMS and they will show here.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {top3.map((p, i) => (
              <Reveal key={p.slug || p.id || i} delay={i * 100}>
                <div
                  onClick={() => onRead(p)}
                  className={`group cursor-pointer relative overflow-hidden rounded-xl p-8 aspect-[4/3] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2 ${
                    p.heroColor || "bg-[#1a1a1a]"
                  }`}
                >
                  <div className="flex justify-between items-start text-white/50">
                    <span className="font-mono text-sm">#{String(p.id || "").padStart(3, "0")}</span>
                    <span className="text-[10px] uppercase tracking-widest-custom border border-white/20 px-2 py-1 rounded">
                      {p.category || "Journal"}
                    </span>
                  </div>

                  <div>
                    <div className="w-8 h-1 bg-white/20 mb-6 group-hover:w-16 transition-all duration-500" />
                    <h3 className="font-serif-display text-2xl md:text-3xl text-white leading-tight mb-2 group-hover:translate-x-1 transition-transform">
                      {p.title || ""}
                    </h3>

                    <div className="flex items-center gap-2 text-white/60 text-xs mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>Read Article</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------------------------- ARCHIVE LIST VIEW ---------------------------- */
const NewsletterArchive = ({ items, loading, onRead, onBack }) => {
  const allArticles = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(allArticles.length / itemsPerPage));
  const currentArticles = allArticles.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [allArticles.length]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-32 pb-20 px-6 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest-custom font-bold hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="font-serif-display text-4xl text-[#1a1a1a] ml-4">The Archive</h1>
        </div>

        {loading ? (
          <div className="text-neutral-500 text-sm">Loading...</div>
        ) : currentArticles.length === 0 ? (
          <div className="text-neutral-500 text-sm">No posts yet.</div>
        ) : (
          <>
            <div className="space-y-2">
              {currentArticles.map((article, i) => (
                <div
                  key={article.slug || article.id || i}
                  onClick={() => onRead(article)}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-neutral-200 cursor-pointer hover:bg-white hover:px-6 -mx-6 transition-all duration-300 rounded-sm"
                >
                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-mono text-xs text-neutral-400">#{article.id || ""}</span>
                      <span className="text-[9px] uppercase tracking-widest-custom border border-neutral-200 px-2 py-0.5 rounded text-neutral-500">
                        {article.category || "Journal"}
                      </span>
                    </div>
                    <h3 className="font-serif-display text-xl md:text-2xl text-[#1a1a1a] group-hover:text-neutral-600 transition-colors mb-2">
                      {article.title || ""}
                    </h3>
                    <p className="text-neutral-500 text-sm font-sans-clean line-clamp-1 max-w-xl font-light">
                      {article.excerpt || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 mt-4 md:mt-0 flex-shrink-0">
                    <span className="text-xs text-neutral-400 font-mono">{formatDate(article.date)}</span>
                    <ArrowRight
                      size={16}
                      className="text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-16 border-t border-neutral-200 pt-8">
              <button
                disabled={page === 0}
                onClick={() => {
                  setPage((p) => Math.max(0, p - 1));
                  window.scrollTo(0, 0);
                }}
                className="text-xs uppercase tracking-widest-custom font-bold disabled:opacity-20 hover:text-neutral-500 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={12} /> Previous
              </button>

              <span className="font-mono text-xs text-neutral-400">
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages - 1}
                onClick={() => {
                  setPage((p) => Math.min(totalPages - 1, p + 1));
                  window.scrollTo(0, 0);
                }}
                className="text-xs uppercase tracking-widest-custom font-bold disabled:opacity-20 hover:text-neutral-500 transition-colors flex items-center gap-2"
              >
                Next <ArrowRight size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------------------------- ARTICLE READER ---------------------------- */
const ArticleReader = ({ article, onBack }) => {
  const [full, setFull] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        if (article?.contentHtml) {
          if (!cancelled) setFull(article);
          return;
        }

        if (article?.slug) {
          const item = await fetchCmsPostBySlug(article.slug);
          if (!cancelled) setFull(item || article);
        } else {
          if (!cancelled) setFull(article);
        }
      } catch (e) {
        if (!cancelled) setFull(article);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [article]);

  const title = full?.title || article?.title || "";
  const date = formatDate(full?.date || article?.date);
  const readingTime = full?.readingTime || article?.readingTime || 4;
  const excerpt = full?.excerpt || article?.excerpt || "";
  const contentHtml = full?.contentHtml || "";

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className={`w-full py-24 px-6 md:px-12 ${full?.heroColor || "bg-[#1a1a1a]"} text-white relative overflow-hidden`}>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="flex justify-center items-center gap-3 mb-8 opacity-80">
            <span className="text-[10px] uppercase tracking-widest-custom font-bold">The Operator&apos;s Handbook</span>
            <span className="w-1 h-1 bg-white rounded-full" />
            <span className="text-[10px] uppercase tracking-widest-custom font-bold">{date || "Latest Issue"}</span>
          </div>

          <h1 className="font-serif-display text-3xl md:text-5xl lg:text-6xl leading-tight mb-8">{title}</h1>

          <div className="flex justify-center items-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-2">
              <Clock size={14} /> {readingTime} min read
            </span>
            <span className="flex items-center gap-2">
              <Users size={14} /> 2,000+ readers
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20">
        {loading ? (
          <div className="text-neutral-500 text-sm">Loading...</div>
        ) : (
          <>
            {excerpt ? (
              <p className="font-sans-clean text-lg text-neutral-600 mb-10 border-l-4 border-[#1a1a1a] pl-6 italic">
                {excerpt}
              </p>
            ) : null}

            {contentHtml ? (
              <div
                className="prose prose-lg prose-neutral max-w-none text-[#1a1a1a] leading-loose"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <div className="text-neutral-600 leading-relaxed">
                No content yet. Your CMS single post endpoint should return contentHtml for this slug.
              </div>
            )}

            <div className="border-t border-neutral-200 pt-12 mt-12 flex flex-col md:flex-row gap-4 justify-between items-center">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-custom hover:text-neutral-500 transition-colors"
              >
                <ChevronLeft size={16} /> Back to Archive
              </button>

              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest-custom hover:text-neutral-500 transition-colors"
              >
                Latest Issues <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------------------------- FOOTER (WORKING KIT SUBSCRIBE) ---------------------------- */
const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-800 relative z-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-5">
          <h2 className="font-serif-display text-5xl mb-8">
            Ready to <span className="italic text-neutral-500">Scale?</span>
          </h2>
          <p className="text-neutral-400 max-w-md font-light leading-relaxed mb-8">
            Stop playing the busy founder game. Build a machine that runs without you.
          </p>

          <EmailSubscriptionForm variant="footer" />
        </div>

        <div className="md:col-span-1" />

        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">Sitemap</h4>
          <ul className="space-y-4 text-sm text-neutral-300">
            {["Home", "Philosophy", "Reviews", "Academy", "Journal"].map((i) => (
              <li key={i}>
                <a href="#" className="hover:text-white transition-colors">
                  {i}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">Connect</h4>
          <ul className="space-y-4 text-sm text-neutral-300">
            {["LinkedIn", "Twitter / X", "Instagram", "Email"].map((i) => (
              <li key={i}>
                <a href="#" className="hover:text-white transition-colors">
                  {i}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">Legal</h4>
          <ul className="space-y-4 text-sm text-neutral-300">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest-custom text-neutral-500">
        <span>© 2025 UmbrellaGTM</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full" />
          <span>All Systems Operational</span>
        </div>
        <span>Lahore • Global</span>
      </div>
    </div>
  </footer>
);

/* ---------------------------- MAIN APP CONTROLLER ---------------------------- */
export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // home | archive
  const [readingPost, setReadingPost] = useState(null);

  const { items, loading } = useCmsPosts();

  const handleRead = (post) => {
    setReadingPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToArchive = () => {
    setReadingPost(null);
    setCurrentPage("archive");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAll = () => {
    setReadingPost(null);
    setCurrentPage("archive");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setReadingPost(null);
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <InfrastructureBackground />
      <div className="grain-overlay" />

      <Navigation
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (page === "home") setReadingPost(null);
        }}
        isReading={!!readingPost || currentPage === "archive"}
      />

      <main>
        {readingPost ? (
          <ArticleReader article={readingPost} onBack={handleBackToArchive} />
        ) : currentPage === "archive" ? (
          <NewsletterArchive
            items={items}
            loading={loading}
            onRead={handleRead}
            onBack={handleGoHome}
          />
        ) : (
          <>
            <Hero />
            <PhilosophyManifesto />
            <AboutAndCapabilities />
            <TrustpilotSection />
            <CourseSection />
            <JournalSection onRead={handleRead} onViewAll={handleViewAll} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
