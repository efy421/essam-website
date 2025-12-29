import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

const LatestWriting = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchKitPosts = async () => {
      try {
        // Updated to use your Kit feed function instead of beehiiv
        const res = await fetch("/.netlify/functions/kit-feed");
        const data = await res.json();
        if (isMounted) {
          // Take the 3 most recent entries for the homepage
          setItems(Array.isArray(data.items) ? data.items.slice(0, 3) : []);
        }
      } catch (err) {
        console.error("Error fetching Kit posts:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchKitPosts();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-32 px-6 md:px-12 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal depth="sm">
          <div className="flex justify-between items-end mb-20">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400 mb-4 block">
                Journal
              </span>
              <h2 className="font-serif-display text-neutral-900 text-5xl md:text-6xl">
                Thinking.
              </h2>
            </div>

            <Link
              to="/newsletter"
              className="hidden md:flex items-center gap-2 text-[10px] uppercase font-bold hover:text-neutral-600 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5 btn-micro"
            >
              Read all entries <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="text-neutral-500 text-sm font-mono uppercase tracking-widest">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
            No entries found in your Kit feed.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {items.map((post, i) => (
              <Reveal key={post.slug || i} delay={i * 90} depth="sm">
                <Link to={`/newsletter/${post.slug}`} className="group cursor-pointer block">
                  <div className="aspect-[4/3] bg-neutral-100 mb-8 overflow-hidden relative rounded-2xl">
                    <div className="absolute inset-0 bg-[#F5F5F0] group-hover:bg-[#EAEAE5] transition-colors duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 font-serif-display text-9xl text-neutral-900 select-none group-hover:opacity-20 transition-opacity">
                      {i + 1}
                    </div>
                    <div className="absolute top-6 left-6 text-[9px] bg-white border border-neutral-200 px-3 py-1 uppercase tracking-widest-custom font-bold shadow-sm rounded-full">
                      Entry
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start border-b border-neutral-200 pb-6 group-hover:border-neutral-900 transition-colors duration-500">
                    <h3 className="text-2xl font-serif-display group-hover:text-neutral-600 transition-colors duration-300 pr-4 leading-tight mb-4">
                      {post.title}
                    </h3>
                    <div className="w-full flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                        {post.date}
                      </span>
                      <Plus className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:rotate-90 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestWriting;