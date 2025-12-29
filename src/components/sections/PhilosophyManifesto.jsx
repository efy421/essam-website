import React from 'react';
import Reveal from '../ui/Reveal';

const PhilosophyManifesto = () => (
  <section id="about" className="py-24 px-6 md:px-12 bg-[#1a1a1a] text-white border-t border-neutral-800">
    <div className="max-w-4xl mx-auto text-center">
      <Reveal depth="sm">
        <div className="mb-10 flex justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 border border-neutral-700 px-3 py-1 rounded-full bg-neutral-900">
            An Open Letter to Founders
          </span>
        </div>
        <h2 className="font-serif-display mb-12" style={{ fontSize: 'var(--h2)', lineHeight: 'var(--leading-tight)' }}>
          "I don't believe in hacks.<br />I believe in <span className="italic text-neutral-400 glow-text">infrastructure.</span>"
        </h2>
      </Reveal>
      <Reveal delay={180} depth="md">
        <div className="space-y-6 font-sans-clean text-neutral-400 font-light max-w-2xl mx-auto" style={{ fontSize: 'var(--body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
          <p>The agency world is drowning in noise. Everyone promises a "secret mechanism" to scale. But the truth is boring: <span className="text-white font-medium">Scale comes from reliable, repetitive systems.</span></p>
          <p>The solopreneur doesn't ask: "How can I make more money?" They ask: "What kind of life do I want to lead?" and then build a business that supports that life.</p>
          <p>It's not about getting more. It's about finding enough.</p>
        </div>
        <div className="mt-12 flex justify-center">
          <img src="/api/placeholder/150/60" alt="Signature" className="opacity-60 h-10 invert" />
        </div>
      </Reveal>
    </div>
  </section>
);

export default PhilosophyManifesto;