import { Injectable } from "@angular/core";
import { Pokemon } from "./donnees/pokemon";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PokemonsService {

  constructor(private http: HttpClient) {}

  private pokemonUrl = 'api/pokemons';

  private log(log: string) { console.info(log); }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.pokemonUrl).pipe(
      tap(_ => this.log('fetched pokemons')),
      catchError(this.handleError('getPokemons', []))
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.pokemonUrl}/${id}`).pipe(
      tap(_ => this.log(`fetched pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
    );
  }

  getPokemonTypes(): string[] {
    return ['Plante', 'Feu', 'Eau', 'Poison', 'Psy', 'Electrik', 'Normal', 'Fée', 'Vol', 'Insecte'];
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const httpOptions = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
    return this.http.put<Pokemon>(`${this.pokemonUrl}/${pokemon.id}`, pokemon, httpOptions).pipe(
      tap(_ => this.log(`updated pokemon id=${pokemon.id}`)),
      catchError(this.handleError<Pokemon>(`updatePokemon id=${pokemon.id}`))
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    const httpOptions = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };
    return this.http.post<Pokemon>(this.pokemonUrl, pokemon, httpOptions).pipe(
      tap((p: Pokemon) => this.log(`added pokemon id=${p.id}`)),
      catchError(this.handleError<Pokemon>('addPokemon'))
    );
  }

  deletePokemon(id: number): Observable<Pokemon> {
    return this.http.delete<Pokemon>(`${this.pokemonUrl}/${id}`).pipe(
      tap(_ => this.log(`deleted pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>('deletePokemon'))
    );
  }

  searchPokemons(term: string): Observable<Pokemon[]> {
    if (!term.trim()) return of([]);
    return this.http.get<Pokemon[]>(`${this.pokemonUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`searched pokemons term=${term}`)),
      catchError(this.handleError<Pokemon[]>('searchPokemons', []))
    );
  }
}
