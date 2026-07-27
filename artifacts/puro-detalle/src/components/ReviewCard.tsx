import React from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../lib/reviews';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass-outlined rounded-2xl p-8 relative flex flex-col flex-1 hover:shadow-[0_12px_45px_rgba(15,30,50,0.12)] transition-shadow duration-500">
      <span className="absolute top-6 left-6 text-6xl text-[#0077D6]/10 font-serif leading-none select-none">
        "
      </span>
      <div className="flex gap-1 relative z-10 pt-2 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`w-4 h-4 ${
              n <= review.rating ? 'text-[#0077D6] fill-[#37B6FF]' : 'text-[#C9CED6]'
            }`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <p className="text-muted-foreground italic font-light text-sm leading-relaxed mb-8 relative z-10 flex-1">
        {review.quote}
      </p>
      <div className="mt-auto">
        <div className="h-[1px] w-12 bg-gradient-to-r from-[#0077D6]/50 to-[#C9CED6]/70 mb-4"></div>
        <h5 className="text-foreground font-medium text-sm">{review.author}</h5>
        {review.car && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            Cliente {review.car}
          </p>
        )}
      </div>
    </div>
  );
}
