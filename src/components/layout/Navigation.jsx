import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Professional Navigation Logic: 
  // If we are on Home page, it scrolls. If on another page, it goes Home first.
  const handleScrollLink = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-[#FDFBF9]/95 backdrop-blur border-neutral-200 py-4' : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="z-50 font-serif-display text-2xl font-medium tracking-tight">
            Essam Shamim.
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => handleScrollLink('about')} className="text-[11px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors">Philosophy</button>
            <button onClick={() => handleScrollLink('reviews')} className="text-[11px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors">Reviews</button>
            <button onClick={() => handleScrollLink('course')} className="text-[11px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors">Academy</button>
            <Link to="/newsletter" className="text-[11px] uppercase tracking-widest-custom font-medium hover:text-neutral-500 transition-colors">Journal</Link>
            
            <button className="btn-micro bg-[#1a1a1a] text-white px-6 py-3 text-[11px] uppercase tracking-widest-custom font-bold hover:bg-neutral-800">
              Get Updates
            </button>
          </div>

          <button className="md:hidden z-50 btn-micro" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#FDFBF9] z-40 transition-transform duration-500 md:hidden flex flex-col justify-center px-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-8">
          <button onClick={() => handleScrollLink('about')} className="font-serif-display text-4xl text-left">Philosophy</button>
          <button onClick={() => handleScrollLink('reviews')} className="font-serif-display text-4xl text-left">Reviews</button>
          <button onClick={() => handleScrollLink('course')} className="font-serif-display text-4xl text-left">Academy</button>
          <Link to="/newsletter" onClick={() => setMobileMenuOpen(false)} className="font-serif-display text-4xl text-left">Journal</Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;