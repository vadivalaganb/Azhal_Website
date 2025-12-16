import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordlimit',
  standalone: true
})
export class WordlimitPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
