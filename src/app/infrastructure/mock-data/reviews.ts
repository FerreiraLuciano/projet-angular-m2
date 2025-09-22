import { Review } from '../../features/reviews/models/review.model';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    movieId: 1311031,
    author: 'Alice',
    content: 'J’ai adoré ce film ! Les scènes d’action sont incroyables.',
    date: '2025-07-19T10:00:00Z',
  },
  {
    id: 2,
    movieId: 1311031,
    author: 'Bob',
    content: 'L’histoire est captivante mais un peu longue.',
    date: '2025-07-20T14:30:00Z',
  },
  {
    id: 3,
    movieId: 755898,
    author: 'Charlie',
    content: 'Pas mon style, mais bien réalisé.',
    date: '2025-07-30T08:15:00Z',
  },
];
