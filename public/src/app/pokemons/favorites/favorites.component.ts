import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Observable, map } from "rxjs";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRaretePipe } from "../pipes/pokemon-rarete.pipe";
import { AsyncPipe } from "@angular/common";

@Component({
  standalone: true,
  selector: 'favorites-pokemons',
  templateUrl: './favorites.component.html',
  imports: [DatePipe, AsyncPipe, RouterLink, PokemonTypeColor, PokemonRaretePipe]
})
export class FavoritesComponent implements OnInit {

  favorites$!: Observable<Pokemon[]>;

  constructor(private router: Router, private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.favorites$ = this.pokemonsService.getPokemons().pipe(
      map(pokemons => pokemons.filter(p => p.isFavorite))
    );
  }

  goToDetail(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  toggleFavorite(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    pokemon.isFavorite = false;
    this.pokemonsService.updatePokemon(pokemon).subscribe(() => {
      this.favorites$ = this.pokemonsService.getPokemons().pipe(
        map(ps => ps.filter(p => p.isFavorite))
      );
    });
  }
}
