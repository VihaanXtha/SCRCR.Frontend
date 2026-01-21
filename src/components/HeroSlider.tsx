import { useState, useEffect } from 'react';
import img1 from '../assets/images/hero-slider/scrc-slider-1-1.jpg';
import img3 from '../assets/images/hero-slider/scrc-slider-3-1.png';
import img4 from '../assets/images/hero-slider/scrc-slider-4-1.jpeg';
import img5 from '../assets/images/hero-slider/scrc-slider-5-1.png';
import img6 from '../assets/images/hero-slider/scrc-slider-6-1.png';
import img7 from '../assets/images/hero-slider/scrc-slider-7-1.jpg';
import img8 from '../assets/images/hero-slider/scrc-slider-8-1.jpg';
import img9 from '../assets/images/hero-slider/scrc-slider-9-1.png';

const images = [img1, img3, img4, img5, img6, img7, img8, img9];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
}
