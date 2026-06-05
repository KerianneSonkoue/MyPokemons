import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, switchMap } from "rxjs";
import { FormsModule } from "@angular/forms";
import { Pokemon } from "../donnees/pokemon";
import { PokemonsService } from "../pokemons.service";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";

@Component({
  standalone: true,
  selector: 'add-pokemon',
  templateUrl: './add-pokemon.component.html',
  imports: [FormsModule, PokemonTypeColor]
})
export class AddPokemonComponent implements OnInit {

  pokemon: Pokemon = new Pokemon();
  types: string[] = [];

  private submitSubject = new Subject<Pokemon>();

  constructor(private router: Router, private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.types = this.pokemonsService.getPokemonTypes();

    // Programmation réactive : le Subject déclenche l'appel HTTP via switchMap
    this.submitSubject.pipe(
      switchMap(p => this.pokemonsService.addPokemon(p))
    ).subscribe(created => {
      this.router.navigate(['/pokemon', created.id]);
    });
  }

  hasType(type: string): boolean {
    return this.pokemon.types.indexOf(type) > -1;
  }

  selectType(event: any, type: string): void {
    if (event.target.checked) {
      this.pokemon.types.push(type);
    } else {
      const idx = this.pokemon.types.indexOf(type);
      if (idx > -1) this.pokemon.types.splice(idx, 1);
    }
  }

  isTypesValid(type: string): boolean {
    if (this.pokemon.types.length === 1 && this.hasType(type)) return false;
    if (this.pokemon.types.length >= 3 && !this.hasType(type)) return false;
    return true;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => { this.pokemon.picture = reader.result as string; };
    reader.readAsDataURL(input.files[0]);
  }

  onSubmit(): void {
    this.pokemon.created = new Date();
    this.submitSubject.next({ ...this.pokemon });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
