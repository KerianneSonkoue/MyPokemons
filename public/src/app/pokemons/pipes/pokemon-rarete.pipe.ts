import { Pipe, PipeTransform } from "@angular/core";

export interface RareteDisplay {
  stars: string;
  colorClass: string;
  label: string;
}

@Pipe({ name: 'pokemonRarete', standalone: true })
export class PokemonRaretePipe implements PipeTransform {
  transform(rarete: number): RareteDisplay {
    const filled = '★'.repeat(rarete);
    const empty  = '☆'.repeat(5 - rarete);

    let colorClass: string;
    let label: string;

    if (rarete <= 2) {
      colorClass = 'rarete-bronze';
      label = 'Bronze';
    } else if (rarete <= 4) {
      colorClass = 'rarete-argent';
      label = 'Argent';
    } else {
      colorClass = 'rarete-or';
      label = 'Or';
    }

    return { stars: filled + empty, colorClass, label };
  }
}
