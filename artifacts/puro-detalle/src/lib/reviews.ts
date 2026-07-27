export type Review = {
  id: number;
  author: string;
  car: string | null;
  rating: number;
  quote: string;
  createdAt: string;
};

const API = `${import.meta.env.BASE_URL}api/reviews`;

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error('No se pudieron cargar las reseñas');
  return res.json();
}

export async function createReview(data: {
  author: string;
  car?: string;
  rating: number;
  quote: string;
}): Promise<Review> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? 'No se pudo guardar la reseña');
  }
  return res.json();
}
