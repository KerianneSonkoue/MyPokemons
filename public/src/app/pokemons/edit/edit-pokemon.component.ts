import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../donnees/pokemon";
import { ActivatedRoute, Router } from "@angular/router";
import { FormPokemonComponent } from "./form-pokemon.component";
import { PokemonsService } from "../pokemons.service";

@Component({
  standalone: true,
  selector: 'edit-Pokemon',
  templateUrl: 'edit-pokemon.component.html',
  imports: [FormPokemonComponent]
})
export class EditPokemonComponent implements OnInit{

  //variable qui va récupérer le pokemon sélectionné
  pokemon: any = null;

  constructor(private route: ActivatedRoute, private router: Router,
              private pokemonsService: PokemonsService
  ){
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.pokemonsService.getPokemon(id).subscribe(pokemon => this.pokemon = pokemon);
    });
  }
  
  goBack(){
    this.router.navigate(['/']);
  }

  goEdit(pokemon: Pokemon){
    let link = ['/pokemon/edit', pokemon.id];
    this.router.navigate(link);
  }

}
