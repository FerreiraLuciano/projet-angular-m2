import { Injectable, signal } from '@angular/core';
import { Review } from '../models/review.model';
import { MOCK_REVIEWS } from '../../../infrastructure/mock-data/reviews';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private storageKey = 'reviews';
  private reviews = signal([] as Review[] | []);

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const reviews: Review[] = saved ? JSON.parse(saved) : [...MOCK_REVIEWS];
    this.reviews.set(reviews);
  }

  private saveReviewToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reviews()));
  }

  getReviewsByMovie(movieId: number): Review[] {
    return this.reviews()
      .filter((c) => c.movieId === movieId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      id: this.reviews().length ? Math.max(...this.reviews().map((c) => c.id)) + 1 : 1,
      date: new Date().toISOString(),
      ...review,
    };
    this.reviews.update((reviews) => [...reviews, newReview]);
    this.saveReviewToLocalStorage();
  }

  getAllReviews(): Review[] {
    return this.reviews();
  }

  deleteReview(reviewId: number) {
    this.reviews.update((reviews) => reviews.filter((review) => review.id !== reviewId));
    this.saveReviewToLocalStorage();
  }
}
