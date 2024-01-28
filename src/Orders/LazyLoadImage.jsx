import { useRef, useEffect, useState } from "react";

const LazyLoadImage = ({ src, alt, className }) => {
  const imageRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(imageRef.current);
          }
        });
      },
      { threshold: 0.5 }
    );

   observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      ref={imageRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className={`lazy-image ${isLoading ? "loading" : "loaded"} ${className}`}
      onLoad={handleImageLoad}
    />
  );
};

export default LazyLoadImage;
