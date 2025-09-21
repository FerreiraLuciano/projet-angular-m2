import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { moviesMock } from '../../../infrastructure/mock-data/movies';
import { WatchlistService } from '../services/watchlist.service';
import { TmdbService } from '../services/tmdb.service';
import { Movie } from '../models/movie.model';
import { PosterUrlPipe } from '../../../shared/pipes/poster-url.pipe';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PosterUrlPipe],
  template: `
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">🎬 Films disponibles</h2>

      @if (tmdb.hasApiKey()) {
      <form (ngSubmit)="searchMovies()" class="flex gap-2 mb-4">
        <input
          type="text"
          [(ngModel)]="query"
          name="query"
          placeholder="Nom du film..."
          class="flex-1 border p-2 rounded"
          required
        />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Rechercher
        </button>
      </form>
      }

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (movie of searchResults(); track movie.id) {
        <div class="bg-gray-50 rounded-lg shadow p-4">
          <img
            [src]="movie | posterUrl"
            [alt]="movie.title"
            class="w-full h-64 object-cover rounded mb-2"
          />
          <h3 class="font-semibold">{{ movie.title }}</h3>
          <p class="text-sm text-gray-600 line-clamp-3">{{ movie.overview }}</p>
          <button
            (click)="addToWatchlist(movie)"
            class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            ➕ Ajouter à la Watchlist
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class MoviesComponent {
  public tmdb = inject(TmdbService);
  private watchlist = inject(WatchlistService);

  query = signal('');
  searchResults = signal<Movie[]>(moviesMock);
  loading = signal(false);

  constructor() {
    this.discoverMovies();
  }

  async discoverMovies() {
    this.loading.set(true);

    try {
      this.loading.set(true);
      const results = await this.tmdb.discoverMovies();
      this.searchResults.set(results);
    } catch (e) {
      console.error('Erreur de recherche TMDB:', e);
    } finally {
      this.loading.set(false);
    }
  }

  async searchMovies() {
    if (!this.query().trim()) {
      await this.discoverMovies();
      return;
    }
    try {
      this.loading.set(true);
      const results = await this.tmdb.searchMovies(this.query());
      this.searchResults.set(results);
    } catch (e) {
      console.error('Erreur de recherche TMDB:', e);
    } finally {
      this.loading.set(false);
    }
  }

  addToWatchlist(movie: Movie) {
    this.watchlist.add(movie);
  }
}
