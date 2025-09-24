import { inject, Injectable } from '@angular/core';
import { Movie, MovieResponse } from '../models/movie.model';
import { MOCK_MOVIES } from '../../../infrastructure/mock-data/movies';
import { environment } from '../../../environnement/env.dev';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.themoviedb.org/3';
  private imageBase = 'https://image.tmdb.org/t/p/w500';

  private apiKey = environment.API_KEY;

  /**
   * Makes an HTTP GET request to the provided URL, processes the movie response,
   * and returns a list of processed movies with formatted properties.
   */
  private async request_wrapper(url: string) {
    const data = await firstValueFrom(this.http.get<MovieResponse>(url));

    return data.results.map((m: Movie) => ({
      ...m,
      posterUrl: m.poster_path ? `${this.imageBase}${m.poster_path}` : undefined,
      backdropUrl: m.backdrop_path ? `${this.imageBase}${m.backdrop_path}` : undefined,
    })) as Movie[];
  }

  /**
   * Searches for movies based on the provided query string. If an API key is not available, mocked data is used instead.
   */
  async searchMovies(query: string): Promise<Movie[]> {
    if (!this.apiKey) {
      return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
    }

    const url = `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`;

    return await this.request_wrapper(url);
  }

  /**
   * Fetches a list of movies from a movie database API or returns a mock movies array if no API key is provided.
   */
  async discoverMovies(): Promise<Movie[]> {
    if (!this.apiKey) {
      return MOCK_MOVIES;
    }

    const url = `${this.baseUrl}/discover/movie`;

    return await this.request_wrapper(url);
  }
}
