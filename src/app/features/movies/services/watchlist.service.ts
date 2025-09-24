import { inject, Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private authService = inject(AuthService);
  private currentUserId = this.authService.currentUser()?.id;

  private watchlist = signal<Movie[]>(this.loadFromStorage());

  /**
   * Retrieves the storage key used for storing data specific to the current user.
   */
  private get storageKey(): string {
    return `watchlist_${this.currentUserId}`;
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.watchlist()));
  }

  private loadFromStorage(): Movie[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Adds a movie to the watchlist if it is not already present.
   */
  add(movie: Movie) {
    if (!this.watchlist().some((m) => m.id === movie.id)) {
      this.watchlist.set([...this.watchlist(), { ...movie, status: 'to-watch' }]);
      this.saveToStorage();
    }
  }

  /**
   * Updates the status of an item in the watchlist based on the provided ID.
   */
  updateStatus(id: number, status: 'to-watch' | 'watched') {
    this.watchlist.set(this.watchlist().map((m) => (m.id === id ? { ...m, status } : m)));
    this.saveToStorage();
  }

  /**
   * Removes an item from the watchlist by its unique identifier.
   */
  remove(id: number) {
    this.watchlist.set(this.watchlist().filter((m) => m.id !== id));
    this.saveToStorage();
  }

  /**
   * Retrieves a list of items from the watchlist with the status 'to-watch'.
   */
  toWatch() {
    return this.watchlist().filter((m) => m.status === 'to-watch');
  }

  /**
   * Filters the watchlist to return only the items that have a status of 'watched'.
   */
  watched() {
    return this.watchlist().filter((m) => m.status === 'watched');
  }
}
