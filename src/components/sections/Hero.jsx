import React from 'react';
import { ArrowDown } from 'lucide-react';
import Reveal from '../ui/Reveal';
import EmailSubscriptionForm from '../ui/EmailSubscriptionForm';

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

export default Hero;