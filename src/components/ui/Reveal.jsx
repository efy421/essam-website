import React, { useState, useEffect, useRef } from 'react';

const useReveal = (triggerOnce = true, threshold = 0.12) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce) observer.unobserve(currentRef);
      }
    }, { threshold, rootMargin: '0px 0px -60px 0px' });
    observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [triggerOnce, threshold]);
  return [ref, isVisible];
};

const Reveal = ({ children, delay = 0, className = '', depth = 'md' }) => {
  const [ref, isVisible] = useReveal();
  const depthMap = { sm: 'translateY(14px)', md: 'translateY(26px)', lg: 'translateY(40px)' };
  return (
    <div ref={ref} className={`reveal-base ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, transform: isVisible ? 'translateY(0)' : depthMap[depth] || depthMap.md }}>
      {children}
    </div>
  );
};
export default Reveal;