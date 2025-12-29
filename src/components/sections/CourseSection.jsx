import React from 'react';
import Reveal from '../ui/Reveal';

const CourseSection = () => (
  <section id="course" className="py-32 px-6 md:px-12 bg-[#0a0a0a] text-[#FDFBF9] relative overflow-hidden">
    <div className="max-w-7xl mx-auto relative z-10">
      <Reveal depth="sm">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-500 mb-4 block">The Academy</span>
            <h2 className="font-serif-display" style={{ fontSize: 'var(--h2)', lineHeight: 'var(--leading-tight)' }}>
              Agency AI <span className="italic text-neutral-600">Systems.</span>
            </h2>
          </div>
          <p className="text-neutral-400 max-w-sm text-right text-sm leading-relaxed">
            Centralize operations and acquisition using AI. Moving from "founder-led chaos" to "machine-driven order".
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

export default CourseSection;