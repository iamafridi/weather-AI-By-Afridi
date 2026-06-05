import { useEffect, useRef } from 'react';
import { animateDonut } from '../../utils/animations';

/**
 * Reusable SVG donut chart.
 * @prop {number} pct    - 0 to 100
 * @prop {string} color  - stroke color (Tailwind or hex)
 * @prop {number} size   - diameter in px (default 100)
 * @prop {number} stroke - stroke width (default 10)
 * @prop {React.ReactNode} children - center label
 */
export default function DonutChart({ pct = 0, color = '#2af5c8', size = 100, stroke = 10, children }) {
  const circleRef = useRef(null);
  const radius      = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      // Start at full offset (empty) then animate to target
      circleRef.current.style.strokeDashoffset = circumference;
      animateDonut(circleRef.current, Math.min(pct, 100), circumference);
    }
  }, [pct, circumference]);

  const clampedColor =
    pct >= 90 ? '#f87171' :
    pct >= 70 ? '#fbbf24' :
    color;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#132540"
          strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={clampedColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
