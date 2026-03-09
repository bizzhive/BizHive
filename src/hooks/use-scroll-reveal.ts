import { useEffect, useRef } from 'react';

export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px' }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        currentRef.classList.add('is-revealed');
        observer.unobserve(currentRef); // Run once
      }
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return ref;
}
