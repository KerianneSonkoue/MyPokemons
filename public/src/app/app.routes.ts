import { Routes } from '@angular/router';
import { CounterComponent } from './pokemons/counter/counter.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { pokemonsRoutes } from './pokemons/pokemons.routes';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon/all', pathMatch: 'full' },
  { path: 'pokemon', children: pokemonsRoutes },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'compteur', component: CounterComponent },
  { path: '**', component: PageNotFoundComponent }
];
