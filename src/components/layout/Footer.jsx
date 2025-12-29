import React from 'react';
import { Link } from 'react-router-dom';
import EmailSubscriptionForm from '../ui/EmailSubscriptionForm';

const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-800">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 mb-24">
        <div className="md:col-span-5">
          <h2 className="font-serif-display text-5xl mb-8">Ready to <span className="italic text-neutral-500">Scale?</span></h2>
          <p className="text-neutral-400 max-w-md font-light leading-relaxed mb-8">Stop playing the "busy founder" game. Let's build a machine that runs without you.</p>
          <EmailSubscriptionForm />
        </div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest-custom mb-8 text-neutral-500">Sitemap</h4>
          <ul className="space-y-4 text-sm text-neutral-300">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/newsletter">Newsletter</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest-custom text-neutral-500">
        <span>© 2025 UmbrellaGTM</span>
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00b67a] rounded-full"></div><span>All Systems Operational</span></div>
        <span>Lahore • Global</span>
      </div>
    </div>
  </footer>
);
export default Footer;