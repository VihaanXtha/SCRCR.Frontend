import { useState, useEffect } from 'react';
import img1 from '../assets/images/hero-slider/scrc-slider-1-1.jpg';
import img3 from '../assets/images/hero-slider/scrc-slider-3-1.png';
import img4 from '../assets/images/hero-slider/scrc-slider-4-1.jpeg';
import img5 from '../assets/images/hero-slider/scrc-slider-5-1.png';
import img6 from '../assets/images/hero-slider/scrc-slider-6-1.png';
import img7 from '../assets/images/hero-slider/scrc-slider-7-1.jpg';
import img8 from '../assets/images/hero-slider/scrc-slider-8-1.jpg';
import img9 from '../assets/images/hero-slider/scrc-slider-9-1.png';

// Array of images to cycle through
const images = [img1, img3, img4, img5, img6, img7, img8, img9];

// HeroSlider Component: A full-width image slider for the homepage
export default function HeroSlider() {
  // State to track the currently displayed image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to handle automatic slide transitions
  useEffect(() => {
    const interval = setInterval(() => {
      // Advance to next slide, wrapping around to 0 when end is reached
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds for better slide feel

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Determine CSS class for each slide based on its position relative to current index
  // This enables smooth transitions and correct z-indexing
  const getSlideClass = (index: number) => {
    if (index === currentIndex) return 'active'; // Current visible slide
    if (index === (currentIndex - 1 + images.length) % images.length) return 'prev'; // Previous slide (exiting)
    if (index === (currentIndex + 1) % images.length) return 'next'; // Next slide (preparing to enter)
    return 'off'; // Hidden slides
  };

  return (
    <div className="hero-slider">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={getSlideClass(index)}
        />
      ))}
    </div>
  );
}
