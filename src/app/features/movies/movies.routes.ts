import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies.component';
import { WatchlistComponent } from './components/watchlist.component';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
  },
];
