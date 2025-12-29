import React from 'react';
import { Star } from 'lucide-react';
import Reveal from '../ui/Reveal';

const TrustpilotSection = () => {
  const reviews = [
    { title: 'Finally, a real operator.', body: "Essam's systems turned our creative chaos into a predictable machine.", author: 'Michael T.', role: 'Founder, ScaleAgency' },
    { title: 'No fluff, just engineering.', body: "The only consultant who actually understands the operational reality of 7-figure shops.", author: 'Sarah Jenkins', role: 'CEO, GrowthPartners' },
    { title: 'ROI within 30 days.', body: 'We stopped bleeding profit within 30 days of implementing his framework.', author: 'David Chen', role: 'Director, Elevate Digital' },
    { title: 'Saved my team 15hrs/week.', body: "I was skeptical about 'automation' but the reporting suite pays for itself.", author: 'Elena R.', role: 'COO, Apex Media' },
    { title: 'Clear and ruthless.', body: "Finally, someone who doesn't speak in 'guru' riddles. Clear and effective.", author: 'James West', role: 'Founder, West & Co.' },
    { title: '$40k MRR added.', body: 'The GTM system we built together added $40k MRR in Q4 alone.', author: 'Marcus L.', role: 'Head of Growth, Veltra' },
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
            <Reveal key={i} delay={i * 45} depth="sm">
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

export default TrustpilotSection;