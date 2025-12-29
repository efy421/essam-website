import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../ui/Reveal';
import essamProfile from '../../assets/images/essam-shamim-400x466.webp';

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
                <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden transition-all duration-700 rounded-[var(--radius-xl)]">
                  <img src={essamProfile} alt="Essam Shamim" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
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
          <Reveal delay={140} depth="md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-6 block flex items-center gap-2">
                <span className="w-2 h-2 bg-neutral-900 rounded-full"></span>About Me
              </span>
              <h3 className="font-serif-display mb-8 text-[#1a1a1a]" style={{ fontSize: 'var(--h3)', lineHeight: 'var(--leading-tight)' }}>
                From operator to architect.
              </h3>
              <div className="space-y-6 text-neutral-600 font-light" style={{ fontSize: 'var(--body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
                <p>I am an operator first. I've served as a Non-Executive Director for multiple seven-figure firms...</p>
                <p>My work is designed for founders who are tired of being the bottleneck. We build assets, not jobs.</p>
              </div>
            </div>
          </Reveal>
          <div className="border-t border-neutral-200 pt-20">
            <Reveal depth="sm">
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-10 block flex items-center gap-2">
                <span className="w-2 h-2 border border-neutral-900 rounded-full"></span>Three ways I can help
              </span>
            </Reveal>
            <div className="flex flex-col">
              {capabilities.map((item, i) => (
                <Reveal key={i} delay={i * 90} depth="sm">
                  <div className="group border-b border-neutral-200 py-10 cursor-pointer hover:bg-neutral-50 transition-colors px-4 -mx-4" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-neutral-400 w-6">0{i + 1}</span>
                        <div>
                          <h3 className={`font-serif-display text-3xl transition-colors duration-300 ${active === i ? 'text-[#1a1a1a]' : 'text-neutral-500'}`}>{item.title}</h3>
                          <span className="text-[10px] uppercase tracking-widest-custom text-neutral-400 mt-2 block group-hover:text-neutral-600">
                            {item.role}
                          </span>
                        </div>
                      </div>
                      <div className={`transform transition-transform duration-300 ${active === i ? 'rotate-45 text-neutral-900' : 'text-neutral-300'}`}>
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                    <div className={`pl-12 transition-all duration-400 ease-out ${active === i ? 'opacity-100 translate-y-0 mt-6' : 'opacity-0 -translate-y-2 pointer-events-none mt-6'}`}>
                      <p className="text-base text-neutral-600 font-light max-w-lg">{item.desc}</p>
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

export default AboutAndCapabilities;