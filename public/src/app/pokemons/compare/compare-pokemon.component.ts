import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRaretePipe } from "../pipes/pokemon-rarete.pipe";

@Component({
  standalone: true,
  selector: 'compare-pokemon',
  templateUrl: './compare-pokemon.component.html',
  imports: [FormsModule, RouterLink, PokemonTypeColor, PokemonRaretePipe]
})
export class ComparePokemonComponent implements OnInit {

  allPokemons: Pokemon[] = [];
  selectedId1: number | null = null;
  selectedId2: number | null = null;

  get pokemon1(): Pokemon | null {
    return this.allPokemons.find(p => p.id === +this.selectedId1!) ?? null;
  }

  get pokemon2(): Pokemon | null {
    return this.allPokemons.find(p => p.id === +this.selectedId2!) ?? null;
  }

  constructor(private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.pokemonsService.getPokemons().subscribe(ps => this.allPokemons = ps);
  }

  winner(val1: number, val2: number): 'left' | 'right' | 'equal' {
    if (val1 > val2) return 'left';
    if (val2 > val1) return 'right';
    return 'equal';
  }
}
