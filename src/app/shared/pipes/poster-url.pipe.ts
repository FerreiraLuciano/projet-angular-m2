import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../../features/movies/models/movie.model';

@Pipe({
  name: 'posterUrl',
  standalone: true,
})
export class PosterUrlPipe implements PipeTransform {
  private imageBase = 'https://image.tmdb.org/t/p/w500';
  private fallback = '/assets/no-poster.png';

  transform(movie: Movie): string {
    if (!movie) return this.fallback;

    if (movie.posterUrl) {
      return movie.posterUrl;
    }

    if (movie.poster_path) {
      return `${this.imageBase}${movie.poster_path}`;
    }

    return this.fallback;
  }
}
