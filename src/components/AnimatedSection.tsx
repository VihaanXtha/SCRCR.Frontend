import { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'scale-up';

export default function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  type = 'fade-up' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  type?: AnimationType;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransformClass = () => {
    if (!isVisible) {
      switch (type) {
        case 'fade-up': return 'opacity-0 translate-y-10';
        case 'fade-down': return 'opacity-0 -translate-y-10';
        case 'fade-left': return 'opacity-0 translate-x-10';
        case 'fade-right': return 'opacity-0 -translate-x-10';
        case 'zoom-in': return 'opacity-0 scale-95';
        case 'scale-up': return 'opacity-0 scale-50';
        default: return 'opacity-0 translate-y-10';
      }
    }
    return 'opacity-100 translate-x-0 translate-y-0 scale-100';
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${getTransformClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
