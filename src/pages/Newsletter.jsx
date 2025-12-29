import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Reveal from '../components/ui/Reveal';

const Newsletter = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/.netlify/functions/kit-feed')
      .then(res => res.json())
      .then(data => {
        setPosts(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching Kit feed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="pt-40 pb-32 px-6 md:px-12 bg-[#FDFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-8">
             <span className="text-[10px] font-bold uppercase tracking-widest-custom text-neutral-400">Archive</span>
          </div>
          <h1 className="font-serif-display text-6xl md:text-8xl mb-20">Newsletter.</h1>
        </Reveal>

        {loading ? (
          <div className="text-neutral-400 font-mono text-xs uppercase tracking-widest">Loading entries...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post, i) => (
              <Reveal key={post.slug || i} delay={i * 100} depth="sm">
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 border-b border-neutral-200 hover:border-neutral-900 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">{post.date}</span>
                    <h3 className="font-serif-display text-3xl group-hover:text-neutral-600 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read Entry</span>
                    <Plus className="w-5 h-5 text-neutral-300 group-hover:rotate-90 group-hover:text-neutral-900 transition-all duration-300" />
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

export default Newsletter;