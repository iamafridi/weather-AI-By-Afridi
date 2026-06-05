import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggered fade-up entrance for hero elements.
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {object} opts
 */
export const heroEntrance = (selector, opts = {}) => {
  const {
    duration = 0.7,
    stagger  = 0.1,
    y        = 40,
    delay    = 0,
  } = opts;

  return gsap.fromTo(selector,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, delay, ease: 'power3.out' }
  );
};

/**
 * ScrollTrigger reveal for section headings / cards.
 * @param {string|Element} selector
 * @param {object} opts
 */
export const scrollReveal = (selector, opts = {}) => {
  const {
    y        = 30,
    duration = 0.6,
    stagger  = 0.08,
    start    = 'top 88%',
  } = opts;

  return gsap.fromTo(selector,
    { opacity: 0, y },
    {
      opacity: 1, y: 0, duration, stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: typeof selector === 'string' ? selector : selector,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
};

/**
 * Animate a number from 0 to target value (counter effect).
 * @param {object} obj - plain object with `val` property (GSAP mutates it)
 * @param {number} target
 * @param {function} onUpdate - called every tick with current rounded value
 * @param {object} opts
 */
export const countUp = (obj, target, onUpdate, opts = {}) => {
  const { duration = 1.2, delay = 0 } = opts;
  return gsap.to(obj, {
    val: target,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => onUpdate(Math.round(obj.val)),
  });
};

/**
 * Slide a donut's stroke-dashoffset from full to pct.
 * @param {SVGElement} el - the <circle> element
 * @param {number} pct - 0–100
 * @param {number} circumference
 */
export const animateDonut = (el, pct, circumference) => {
  const offset = circumference - (pct / 100) * circumference;
  gsap.to(el, {
    strokeDashoffset: offset,
    duration: 1.2,
    ease: 'power2.out',
  });
};

/**
 * Pulse glow on a DOM element (used for the live weather card).
 * @param {Element} el
 */
export const pulseGlow = (el) =>
  gsap.to(el, {
    boxShadow: '0 0 32px rgba(42,245,200,0.25)',
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: 'sine.inOut',
  });

export { gsap, ScrollTrigger };
