import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../services/watchlist.service';
import { PosterUrlPipe } from '../../../shared/pipes/poster-url.pipe';
import { DetailButtonComponent } from '../../../shared/components/buttons/detail-button.component';

@Component({
  selector: 'app-watchlist-page',
  standalone: true,
  imports: [CommonModule, PosterUrlPipe, DetailButtonComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- À voir -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">🎬 À voir ({{ watchlist.toWatch().length }})</h3>
        <div class="space-y-3">
          @for (movie of watchlist.toWatch(); track movie.id) {
          <div class="bg-white p-3 rounded shadow flex gap-3 relative">
            <img
              [src]="movie | posterUrl"
              alt="img poster"
              class="w-16 h-24 object-cover rounded"
            />
            <app-detail-button [movieId]="movie.id"></app-detail-button>
            <div class="flex-1 ">
              <h4 class="font-medium">{{ movie.title }}</h4>
              <button
                (click)="markAsWatched(movie.id)"
                class="text-green-600 hover:text-green-800 text-sm"
              >
                ✅ Marquer comme vu
              </button>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Déjà vus -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">👀 Déjà vus ({{ watchlist.watched().length }})</h3>
        <div class="space-y-3">
          @for (movie of watchlist.watched(); track movie.id) {
          <div class="bg-white p-3 rounded shadow flex gap-3 relative">
            <app-detail-button [movieId]="movie.id"></app-detail-button>
            <img
              [src]="movie | posterUrl"
              alt="img poster"
              class="w-16 h-24 object-cover rounded"
            />
            <div class="flex-1">
              <h4 class="font-medium line-through">{{ movie.title }}</h4>
              <button
                (click)="removeMovie(movie.id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class WatchlistComponent {
  public watchlist = inject(WatchlistService);

  markAsWatched(id: number) {
    this.watchlist.updateStatus(id, 'watched');
  }

  removeMovie(id: number) {
    this.watchlist.remove(id);
  }
}
