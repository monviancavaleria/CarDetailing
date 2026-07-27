import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { fetchReviews } from '../lib/reviews';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';

export default function ReviewsPage() {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-foreground font-sans pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0077D6] font-medium mb-8 hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la página principal
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-wider text-center mb-3">
          Todas nuestras reseñas
        </h1>
        <p className="text-center text-muted-foreground font-light mb-12">
          Lo que opinan quienes ya han confiado en Puro Detalle.
        </p>

        {isLoading && (
          <p className="text-center text-muted-foreground font-light py-10">Cargando reseñas…</p>
        )}
        {isError && (
          <p className="text-center text-muted-foreground font-light py-10">
            No se pudieron cargar las reseñas. Inténtalo más tarde.
          </p>
        )}

        {reviews && reviews.length === 0 && (
          <div className="glass-outlined rounded-2xl p-10 text-center max-w-2xl mx-auto mb-12">
            <p className="text-foreground font-medium mb-2">Aún no hay reseñas</p>
            <p className="text-muted-foreground text-sm font-light">
              Sé el primero en contarnos tu experiencia.
            </p>
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        <ReviewForm />
      </div>
    </div>
  );
}
