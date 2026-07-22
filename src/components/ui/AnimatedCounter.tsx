"use client";

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration in ms
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = countRef.current;
    const endValue = value;

    // Reset or update based on prop changes
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad
      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setCount(currentValue);
      countRef.current = currentValue;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
        countRef.current = endValue;
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count.toLocaleString('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
}
