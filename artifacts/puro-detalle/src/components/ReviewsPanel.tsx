import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { PenLine, ArrowRight } from 'lucide-react';
import { fetchReviews } from '../lib/reviews';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const ROTATE_MS = 8000;

export default function ReviewsPanel() {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  });
  const [page, setPage] = React.useState(0);
  const [showForm, setShowForm] = React.useState(false);

  const pages = React.useMemo(() => {
    if (!reviews?.length) return [];
    const chunks = [];
    for (let i = 0; i < reviews.length; i += 3) chunks.push(reviews.slice(i, i + 3));
    return chunks;
  }, [reviews]);

  // Rotación automática de tres en tres
  React.useEffect(() => {
    if (pages.length <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [pages.length]);

  const current = pages.length ? pages[page % pages.length] : [];

  return (
    <div>
      {isLoading && (
        <p className="text-center text-muted-foreground font-light py-10">Cargando reseñas…</p>
      )}
      {isError && (
        <p className="text-center text-muted-foreground font-light py-10">
          No se pudieron cargar las reseñas. Inténtalo más tarde.
        </p>
      )}

      {!isLoading && !isError && pages.length === 0 && (
        <div className="glass-outlined rounded-2xl p-10 text-center max-w-2xl mx-auto mb-8">
          <p className="text-foreground font-medium mb-2">Aún no hay reseñas</p>
          <p className="text-muted-foreground text-sm font-light">
            Sé el primero en contarnos tu experiencia.
          </p>
        </div>
      )}

      {pages.length > 0 && (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={page % pages.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-6 md:gap-8"
            >
              {current.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {/* Relleno para mantener el ancho cuando hay menos de 3 */}
              {current.length < 3 &&
                Array.from({ length: 3 - current.length }).map((_, i) => (
                  <div key={`f-${i}`} className="hidden md:block flex-1" />
                ))}
            </motion.div>
          </AnimatePresence>

          {pages.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ver grupo de reseñas ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === page % pages.length ? 'bg-[#0077D6]' : 'bg-[#C9CED6]'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold tracking-wide text-white bg-gradient-to-r from-[#0077D6] to-[#37B6FF] shadow-[0_6px_20px_rgba(0,119,214,0.35)] hover:shadow-[0_8px_28px_rgba(0,119,214,0.45)] transition-all"
        >
          <PenLine className="w-4 h-4" />
          {showForm ? 'Ocultar formulario' : 'Deja tu reseña'}
        </button>
        <Link
          href="/resenas"
          className="flex items-center gap-2 px-6 py-3 rounded-xl glass-outlined font-sans font-semibold tracking-wide text-foreground hover:bg-white/80 hover:shadow-[0_8px_28px_rgba(15,30,50,0.12)] transition-all"
        >
          Ver todas las reseñas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {showForm && (
        <div className="mt-8">
          <ReviewForm />
        </div>
      )}
    </div>
  );
}
