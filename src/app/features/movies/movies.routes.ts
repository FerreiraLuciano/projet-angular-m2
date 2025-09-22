import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies.component';
import { WatchlistComponent } from './components/watchlist.component';
import { MovieDetailsComponent } from '../reviews/components/movie-details.component';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
  {
    path: 'details/:id',
    component: MovieDetailsComponent,
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
  },
];
