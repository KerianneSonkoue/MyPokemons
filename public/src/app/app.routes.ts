import { Routes } from '@angular/router';
import { CounterComponent } from './pokemons/counter/counter.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { pokemonsRoutes } from './pokemons/pokemons.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon/all', pathMatch: 'full' },
  { path: 'pokemon', children: pokemonsRoutes },
  { path: 'compteur', component: CounterComponent },
  { path: '**', component: PageNotFoundComponent }
];


