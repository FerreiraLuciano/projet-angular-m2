import { Injectable, signal } from '@angular/core';
import { Review } from '../models/review.model';
import { MOCK_REVIEWS } from '../../../infrastructure/mock-data/reviews';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private storageKey = 'reviews';
  private reviews = signal([] as Review[] | []);

  /**
   * Initializes a new instance of the class. We aattempt to retrieve saved reviews from local storage using the specified storage key.
   * If no saved data is available, it initializes the reviews with a default set of mock reviews.
   */
  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const reviews: Review[] = saved ? JSON.parse(saved) : [...MOCK_REVIEWS];
    this.reviews.set(reviews);
  }

  private saveReviewToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reviews()));
  }

  /**
   * Retrieves and returns a list of reviews associated with a specific movie,
   * sorted in descending order by the review date.
   */
  getReviewsByMovie(movieId: number): Review[] {
    return this.reviews()
      .filter((c) => c.movieId === movieId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Adds a new review to the list of reviews with a generated ID and current date.
   */
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

  /**
   * Deletes a review from the list of reviews based on the provided review ID.
   */
  deleteReview(reviewId: number) {
    this.reviews.update((reviews) => reviews.filter((review) => review.id !== reviewId));
    this.saveReviewToLocalStorage();
  }
}
