import { Star } from 'lucide-react';

export function Rating({ value, size = 15, label }) {
  return (
    <div className="rating" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={size} fill={index < Math.round(value) ? 'currentColor' : 'none'} />
      ))}
      {label && <span>{label}</span>}
    </div>
  );
}
