import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { DatePipe, AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRaretePipe } from "../pipes/pokemon-rarete.pipe";
import { BorderCardDirective } from "../directives/border-card.directive";
import { Router } from "@angular/router";
import { PokemonsService } from "../pokemons.service";
import { RouterLink } from "@angular/router";
import { SearchPokemonComponent } from "../search-pokemons/search-pokemons.component";
import { BehaviorSubject, combineLatest, Observable, map, Subject, switchMap } from "rxjs";

@Component({
  standalone: true,
  selector: 'list-pokemons',
  templateUrl: './pokemons.component.html',
  imports: [DatePipe, AsyncPipe, FormsModule, RouterLink, SearchPokemonComponent, PokemonTypeColor, PokemonRaretePipe, BorderCardDirective]
})
export class PokemonsComponent implements OnInit {

  private allPokemons$ = new BehaviorSubject<Pokemon[]>([]);
  private deleteSubject = new Subject<number>();

  typeFilter$    = new BehaviorSubject<string>('');
  rarityFilter$  = new BehaviorSubject<string>('');
  filteredPokemons$!: Observable<Pokemon[]>;

  selectedType    = '';
  selectedRarity  = '';

  readonly pokemonTypes: string[];
  readonly rarityOptions = [
    { label: 'Toutes', value: '' },
    { label: 'Bronze (1-2★)', value: 'Bronze' },
    { label: 'Argent (3-4★)', value: 'Argent' },
    { label: 'Or (5★)',       value: 'Or' }
  ];

  constructor(private router: Router, private pokemonService: PokemonsService) {
    this.pokemonTypes = pokemonService.getPokemonTypes();
  }

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(ps => this.allPokemons$.next(ps));

    // Programmation réactive : combineLatest fusionne la liste + les 2 filtres
    this.filteredPokemons$ = combineLatest([
      this.allPokemons$,
      this.typeFilter$,
      this.rarityFilter$
    ]).pipe(
      map(([pokemons, type, rarity]) =>
        pokemons
          .filter(p => !type || p.types.includes(type))
          .filter(p => {
            if (!rarity) return true;
            if (rarity === 'Bronze') return p.rarete <= 2;
            if (rarity === 'Argent') return p.rarete >= 3 && p.rarete <= 4;
            return p.rarete === 5;
          })
      )
    );

    // Programmation réactive : Subject + switchMap pour la suppression
    this.deleteSubject.pipe(
      switchMap(id => this.pokemonService.deletePokemon(id).pipe(
        map(() => id)
      ))
    ).subscribe(deletedId => {
      this.allPokemons$.next(
        this.allPokemons$.getValue().filter(p => p.id !== deletedId)
      );
    });
  }

  selectPokemon(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  deletePokemon(pokemon: Pokemon, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Supprimer ${pokemon.name} ?`)) return;
    this.deleteSubject.next(pokemon.id);
  }

  resetFilters(): void {
    this.selectedType   = '';
    this.selectedRarity = '';
    this.typeFilter$.next('');
    this.rarityFilter$.next('');
  }
}
