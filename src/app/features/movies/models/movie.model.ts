export interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  backdrop_path?: string;
  posterUrl?: string;
  backdropUrl?: string;
  adult: boolean;
  genre_ids: number[];
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  status?: 'to-watch' | 'watched'; // notre watchlist
}

export interface MovieRequest {
  movie: Movie;
  user: number;
  status: 'watched' | 'to watch';
}

export interface MovieResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}
