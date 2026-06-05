import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { PokemonRaretePipe } from "../pipes/pokemon-rarete.pipe";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { PokemonsService } from "../pokemons.service";

@Component({
  standalone: true,
  selector: 'detail-Pokemon',
  templateUrl: 'detail-pokemon.component.html',
  imports: [PokemonTypeColor, PokemonRaretePipe, DatePipe]
})
export class DetailPokemonComponent implements OnInit {

  pokemon: any = null;
  private allIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonsService: PokemonsService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.pokemonsService.getPokemon(id).subscribe(p => this.pokemon = p);
    this.pokemonsService.getPokemons().subscribe(ps => {
      this.allIds = ps.map(p => p.id).sort((a, b) => a - b);
    });
  }

  get prevId(): number | null {
    const idx = this.allIds.indexOf(this.pokemon?.id);
    return idx > 0 ? this.allIds[idx - 1] : null;
  }

  get nextId(): number | null {
    const idx = this.allIds.indexOf(this.pokemon?.id);
    return idx !== -1 && idx < this.allIds.length - 1 ? this.allIds[idx + 1] : null;
  }

  goPrev(): void { if (this.prevId) this.router.navigate(['/pokemon', this.prevId]); }
  goNext(): void { if (this.nextId) this.router.navigate(['/pokemon', this.nextId]); }

  toggleFavorite(): void {
    this.pokemon.isFavorite = !this.pokemon.isFavorite;
    this.pokemonsService.updatePokemon(this.pokemon).subscribe();
  }

  goBack(): void { this.router.navigate(['/']); }

  goEdit(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon/edit', pokemon.id]);
  }
}
