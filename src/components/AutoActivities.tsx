import '../App.css'
import { useRef, useEffect, useState } from 'react'

export default function AutoActivities({ activities }: { activities: { title: string; img?: string }[] }) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => {
        const newOffset = prev + 0.5; // Adjust speed here
        // Reset if we've scrolled past the first set of items
        if (containerRef.current && newOffset >= containerRef.current.scrollWidth / 2) {
          return 0;
        }
        return newOffset;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Duplicate items to create seamless loop
  const displayActivities = [...activities, ...activities];

  return (
    <div className="overflow-hidden w-full py-4" onMouseEnter={() => cancelAnimationFrame(requestRef.current)} onMouseLeave={() => { requestRef.current = requestAnimationFrame(() => setOffset(prev => prev + 0.5)); }}>
      <div 
        ref={containerRef}
        className="flex gap-4"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        {displayActivities.map((a, i) => (
          <div key={`${a.title}-${i}`} className="card min-w-[300px] flex-shrink-0">
            {a.img && <img src={a.img} alt={a.title} className="h-[200px] w-full object-cover" />}
            <div className="card-title">{a.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
