import { useEffect } from "preact/hooks";

interface Props {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  staggerMs?: number;
}

const ScrollRevealIsland = ({ selector = ".reveal", rootMargin = "0px 0px -10% 0px", threshold = 0.15, staggerMs = 60 }: Props) => {
  useEffect(() => {
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const elems = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elems.length) return;

    elems.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "opacity 350ms cubic-bezier(.2,.9,.2,1), transform 350ms cubic-bezier(.2,.9,.2,1)";
    });

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = elems.indexOf(entry.target as HTMLElement);
          const el = entry.target as HTMLElement;
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "none";
          }, index * staggerMs);
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin, threshold }
    );

    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, rootMargin, threshold, staggerMs]);

  return null;
};

export default ScrollRevealIsland;

