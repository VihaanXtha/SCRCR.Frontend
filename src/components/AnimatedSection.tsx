import { useEffect, useRef, useState } from 'react';

// Define allowed animation types for type safety
type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'scale-up';

/**
 * AnimatedSection Component
 * -------------------------
 * A wrapper component that triggers CSS animations when the element enters the viewport.
 * Uses the Intersection Observer API to detect visibility.
 * 
 * Props:
 * @param {React.ReactNode} children - The content to animate.
 * @param {string} [className] - Additional CSS classes.
 * @param {number} [delay] - Delay before animation starts (in ms).
 * @param {AnimationType} [type] - The type of animation to apply.
 */
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
  // State to track if the element has appeared on screen
  const [isVisible, setIsVisible] = useState(false);
  
  // Ref to access the DOM element we want to observe
  const ref = useRef<HTMLDivElement>(null);

  // useEffect to set up the Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true); // Trigger animation
          observer.unobserve(entry.target); // Stop observing once visible (animate only once)
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    // Start observing the element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup: stop observing when component unmounts
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  /**
   * Helper function to determine the initial CSS classes based on animation type.
   * Returns classes that hide/offset the element when !isVisible.
   * Returns classes that show/reset the element when isVisible.
   */
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
    // When visible, reset opacity and transforms to natural state
    return 'opacity-100 translate-x-0 translate-y-0 scale-100';
  };

  return (
    <div
      ref={ref}
      // Combine transition classes with our dynamic transform classes
      className={`transition-all duration-1000 ease-out transform ${getTransformClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
