import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const EmailSubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setStatus('error'); return; }
    setStatus('loading');
    try {
      const response = await fetch("/.netlify/functions/kit-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });      
      if (response.ok) { setStatus('success'); setEmail(''); } 
      else { setStatus('error'); }
    } catch (err) { setStatus('error'); }
  };
  return (
    <div>
      {status === 'success' ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <p className="text-green-800 text-sm font-medium flex items-center gap-2">Success! Check your email.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="input-focus flex flex-col sm:flex-row max-w-md border-b border-[#1a1a1a]">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="bg-transparent w-full py-4 px-2" />
            <button type="submit" disabled={status === 'loading'} className="btn-micro whitespace-nowrap px-6 py-4 flex items-center justify-center gap-2 uppercase text-[10px] font-bold tracking-widest-custom">
              {status === 'loading' ? 'Joining...' : <>Join the list <ArrowRight size={14} /></>}
            </button>
          </div>
          {status === 'error' && <p className="mt-4 text-red-800 text-sm">Something went wrong.</p>}
        </form>
      )}
    </div>
  );
};
export default EmailSubscriptionForm;