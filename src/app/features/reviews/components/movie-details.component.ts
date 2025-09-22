import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PosterUrlPipe } from '../../../shared/pipes/poster-url.pipe';
import { WatchlistService } from '../../movies/services/watchlist.service';
import { ReviewService } from '../services/review.service';
import { Movie } from '../../movies/models/movie.model';
import { MOCK_MOVIES } from '../../../infrastructure/mock-data/movies';
import { Review } from '../models/review.model';
import { AuthService } from '../../auth/services/auth.service';
import { DatePipe } from '../../../shared/pipes/date.pipe';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PosterUrlPipe, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div class="flex flex-col md:flex-row gap-6">
        <img
          [src]="movie() | posterUrl"
          [alt]="movie().title"
          class="w-full md:w-64 h-auto rounded"
        />
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">{{ movie().title }}</h2>
          <p class="text-sm text-gray-500 mb-2">
            📅 {{ movie().release_date }} | 🌐 {{ movie().original_language | uppercase }}
          </p>
          <p class="text-sm text-gray-600 mb-4">{{ movie().overview }}</p>

          @if (movie()) {
          <button
            (click)="toggleWatchlist(movie())"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            {{ isInWatchlist(movie()) ? 'Supprimer de ma Watchlist' : 'Ajouter à ma Watchlist' }}
          </button>
          }
        </div>
      </div>

      <hr class="my-4" />

      <!-- Section Reviews -->
      <div>
        <h3 class="text-xl font-semibold mb-2">💬 Reviews</h3>

        <form (ngSubmit)="addReview()" class="mb-4">
          <textarea
            [(ngModel)]="newReview.content"
            name="content"
            placeholder="Votre review"
            class="border p-2 rounded w-full mb-2"
            rows="3"
            required
          ></textarea>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Poster la review
          </button>
        </form>

        <div class="space-y-4">
          @for (review of reviews(); track review.id) {
          <div class="border p-3 rounded bg-gray-50">
            <div class="flex justify-between items-center mb-1">
              <span class="font-semibold">{{ review.author }}</span>
              <span class="text-xs text-gray-400">{{ review.date | Date }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ review.content }}</p>
          </div>
          } @if (reviews().length === 0) {
          <p class="text-gray-500 text-sm">Aucune review pour le moment.</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private watchlist = inject(WatchlistService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  movie = signal<Movie>(MOCK_MOVIES[0]);
  reviews = signal<Review[]>([]);

  newReview = {
    author: this.authService.currentUser()?.name || 'Anonyme',
    content: '',
  };

  ngOnInit() {
    const movieId = Number(this.route.snapshot.params['id']);
    const found = MOCK_MOVIES.find((m) => m.id === movieId);
    this.movie.set(found || MOCK_MOVIES[0]);
    this.loadReviews();
  }

  loadReviews() {
    if (!this.movie()) return;
    this.reviews.set(this.reviewService.getReviewsByMovie(this.movie()!.id));
  }

  addReview() {
    if (!this.newReview.author.trim() || !this.newReview.content.trim()) return;
    if (!this.movie()) return;

    this.reviewService.addReview({
      author: this.newReview.author,
      content: this.newReview.content,
      movieId: this.movie().id,
    });

    this.newReview.content = '';
    this.loadReviews();
  }

  toggleWatchlist(movie: Movie) {
    if (this.isInWatchlist(movie)) {
      this.watchlist.remove(movie.id);
    } else {
      this.watchlist.add(movie);
    }
  }

  isInWatchlist(movie: Movie): boolean {
    return this.watchlist.toWatch().some((m) => m.id === movie.id);
  }
}
