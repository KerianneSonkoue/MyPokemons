import { Injectable } from '@angular/core';
import { from, Observable, of, map } from 'rxjs';
import { Pokemon } from './donnees/pokemon';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class PokemonsService {

  constructor(private supabaseService: SupabaseService) {}

  private get db() {
    return this.supabaseService.client;
  }

  private mapToPokemon(row: any): Pokemon {
    const p = new Pokemon();
    p.id         = row.id;
    p.name       = row.name;
    p.hp         = row.hp;
    p.cp         = row.cp;
    p.picture    = row.picture;
    p.types      = row.types ?? [];
    p.created    = new Date(row.created);
    p.rarete     = row.rarete ?? 1;
    p.isFavorite = row.is_favorite ?? false;
    return p;
  }

  private mapToRow(pokemon: Pokemon): any {
    return {
      name:        pokemon.name,
      hp:          pokemon.hp,
      cp:          pokemon.cp,
      picture:     pokemon.picture,
      types:       pokemon.types,
      rarete:      pokemon.rarete,
      is_favorite: pokemon.isFavorite
    };
  }

  getPokemons(): Observable<Pokemon[]> {
    return from(
      this.db.from('pokemons').select('*').order('id')
    ).pipe(
      map(({ data, error }) => {
        if (error) { console.error(error); return []; }
        return (data ?? []).map(row => this.mapToPokemon(row));
      })
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    return from(
      this.db.from('pokemons').select('*').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) { console.error(error); return new Pokemon(); }
        return this.mapToPokemon(data);
      })
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    const row = { ...this.mapToRow(pokemon), created: new Date().toISOString() };
    return from(
      this.db.from('pokemons').insert(row).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) { console.error(error); return new Pokemon(); }
        return this.mapToPokemon(data);
      })
    );
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return from(
      this.db.from('pokemons').update(this.mapToRow(pokemon)).eq('id', pokemon.id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) { console.error(error); return new Pokemon(); }
        return this.mapToPokemon(data);
      })
    );
  }

  deletePokemon(id: number): Observable<any> {
    return from(
      this.db.from('pokemons').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) console.error(error);
        return {};
      })
    );
  }

  searchPokemons(term: string): Observable<Pokemon[]> {
    if (!term.trim()) return of([]);
    return from(
      this.db.from('pokemons').select('*').ilike('name', `%${term}%`)
    ).pipe(
      map(({ data, error }) => {
        if (error) { console.error(error); return []; }
        return (data ?? []).map(row => this.mapToPokemon(row));
      })
    );
  }

  getPokemonTypes(): string[] {
    return ['Plante', 'Feu', 'Eau', 'Poison', 'Psy', 'Electrik', 'Normal', 'Fée', 'Vol', 'Insecte'];
  }
}
