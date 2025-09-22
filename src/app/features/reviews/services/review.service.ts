import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';
import { MOCK_REVIEWS } from '../../../infrastructure/mock-data/reviews';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private storageKey = 'reviews';
  private reviews: Review[] = [];

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.reviews = saved ? JSON.parse(saved) : [...MOCK_REVIEWS];
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
  }

  getReviewsByMovie(movieId: number): Review[] {
    return this.reviews
      .filter((c) => c.movieId === movieId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      id: this.reviews.length ? Math.max(...this.reviews.map((c) => c.id)) + 1 : 1,
      date: new Date().toISOString(),
      ...review,
    };
    this.reviews.push(newReview);
    this.persist();
  }
}
