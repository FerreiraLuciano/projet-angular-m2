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

  private get storageKey(): string {
    return this.currentUserId ? `watchlist_${this.currentUserId}` : 'watchlist_guest';
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.watchlist()));
  }

  private loadFromStorage(): Movie[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  add(movie: Movie) {
    if (!this.watchlist().some((m) => m.id === movie.id)) {
      this.watchlist.set([...this.watchlist(), { ...movie, status: 'to-watch' }]);
      this.saveToStorage();
    }
  }

  updateStatus(id: number, status: 'to-watch' | 'watched') {
    this.watchlist.set(this.watchlist().map((m) => (m.id === id ? { ...m, status } : m)));
    this.saveToStorage();
  }

  remove(id: number) {
    this.watchlist.set(this.watchlist().filter((m) => m.id !== id));
    this.saveToStorage();
  }

  toWatch() {
    return this.watchlist().filter((m) => m.status === 'to-watch');
  }

  watched() {
    return this.watchlist().filter((m) => m.status === 'watched');
  }
}
