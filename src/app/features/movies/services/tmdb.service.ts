import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { moviesMock } from '../../../infrastructure/mock-data/movies';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiKey = '';
  private baseUrl = 'https://api.themoviedb.org/3';
  private imageBase = 'https://image.tmdb.org/t/p/w500';

  async searchMovies(query: string): Promise<Movie[]> {
    if (!this.apiKey) {
      return moviesMock.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
    }

    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.results.map((m: Movie) => ({
      ...m,
      posterUrl: m.poster_path ? `${this.imageBase}${m.poster_path}` : undefined,
      backdropUrl: m.backdrop_path ? `${this.imageBase}${m.backdrop_path}` : undefined,
    })) as Movie[];
  }

  async discoverMovies(): Promise<Movie[]> {
    if (!this.apiKey) {
      return moviesMock;
    }

    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.results.map((m: Movie) => ({
      ...m,
      posterUrl: m.poster_path ? `${this.imageBase}${m.poster_path}` : undefined,
      backdropUrl: m.backdrop_path ? `${this.imageBase}${m.backdrop_path}` : undefined,
    })) as Movie[];
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}
