import { Component, OnInit, Input } from "@angular/core";
import { PokemonTypeColor } from "../pipes/pokemon-type-color.pipe";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PokemonsService } from "../pokemons.service";
import { ImageEditorComponent } from "./image-editor.component";

@Component({
  standalone: true,
  selector: 'form-pokemon',
  templateUrl: './form-pokemon.component.html',
  imports: [PokemonTypeColor, FormsModule, ImageEditorComponent]
})
export class FormPokemonComponent implements OnInit{

  @Input() pokemon: any

  types: any = [];
  showEditor = false;

  constructor(private router: Router, private pokemonsService: PokemonsService){
    this.types = this.pokemonsService.getPokemonTypes();
  }

  ngOnInit(): void {

  }


  // 1 - Détermine si le type passé en paramètres appartient ou non au pokémon en cours d'édition
  hasType(type:string):boolean{
    let index = this.pokemon.types.indexOf(type);
    return (index > -1);
    
  }
  
  // 2 - Permet au joueur d'ajouter ou retirer un type au pokémon en cours d'attente
  selectType($event: any, type:string):void
  {
    let checked = $event.target.checked;

    if(checked){
      this.pokemon.types.push(type)
    }else{
      let index = this.pokemon.types.indexOf(type);
      if(index > -1){
        this.pokemon.types.splice(index, 1);
      }
    }
  }

  // 3 - Valide le nombre de type pour chaque pokémon
  isTypesValid(type: string):boolean
  {
    if(this.pokemon.types.length === 1 && this.hasType(type)){ 
      return false;
    }

    if(this.pokemon.types.length >= 3 && !this.hasType(type)){
      return false;
    }

    return true
  }

  

  onImageEdited(url: string): void {
    this.pokemon.picture = url;
    this.showEditor = false;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.pokemon.picture = reader.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }

  onSubmit(){

    this.pokemonsService.updatePokemon(this.pokemon).subscribe( () => 
      this.router.navigate(['pokemon', this.pokemon.id])
    )

    let link= ['pokemon', this.pokemon.id];
    this.router.navigate(link);
  }

  goBack(){
    let link= ['pokemon', this.pokemon.id];
    this.router.navigate(link);
  }

}