import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { createReview } from '../lib/reviews';

export default function ReviewForm({ onDone }: { onDone?: () => void }) {
  const queryClient = useQueryClient();
  const [author, setAuthor] = React.useState('');
  const [car, setCar] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [quote, setQuote] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setSent(true);
      setAuthor('');
      setCar('');
      setRating(0);
      setQuote('');
      setError(null);
      onDone?.();
    },
    onError: (e: Error) => setError(e.message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (author.trim().length < 2) return setError('Escribe tu nombre (mínimo 2 letras).');
    if (rating < 1) return setError('Elige una valoración de 1 a 5 estrellas.');
    if (quote.trim().length < 10) return setError('Cuéntanos un poco más (mínimo 10 caracteres).');
    mutation.mutate({
      author: author.trim(),
      car: car.trim() || undefined,
      rating,
      quote: quote.trim(),
    });
  };

  if (sent) {
    return (
      <div className="glass-blue border-[#0077D6]/30 rounded-2xl p-8 text-center">
        <p className="text-foreground font-medium mb-2">¡Gracias por tu reseña!</p>
        <p className="text-muted-foreground text-sm font-light">
          Ya está publicada junto a las demás.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-[#0077D6] underline underline-offset-4"
        >
          Escribir otra
        </button>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl glass-outlined px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0077D6]';

  return (
    <form onSubmit={submit} className="glass-outlined rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
      <h4 className="text-lg font-serif uppercase tracking-wider text-foreground mb-5 text-center">
        Deja tu reseña
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Tu nombre *"
          maxLength={80}
          className={inputCls}
        />
        <input
          value={car}
          onChange={(e) => setCar(e.target.value)}
          placeholder="Tu coche (opcional)"
          maxLength={60}
          className={inputCls}
        />
      </div>
      <div className="flex items-center justify-center gap-2 mb-4" role="radiogroup" aria-label="Valoración">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} estrellas`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                n <= (hover || rating) ? 'text-[#0077D6] fill-[#37B6FF]' : 'text-[#C9CED6]'
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <textarea
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="¿Qué te ha parecido nuestro servicio? *"
        maxLength={600}
        rows={4}
        className={`${inputCls} resize-none mb-4`}
      />
      {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-xl px-6 py-3 font-sans font-semibold tracking-wide text-white bg-gradient-to-r from-[#0077D6] to-[#37B6FF] shadow-[0_6px_20px_rgba(0,119,214,0.35)] hover:shadow-[0_8px_28px_rgba(0,119,214,0.45)] transition-all disabled:opacity-60"
      >
        {mutation.isPending ? 'Enviando…' : 'Publicar reseña'}
      </button>
    </form>
  );
}
