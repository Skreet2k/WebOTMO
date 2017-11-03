import { Pipe, PipeTransform } from '@angular/core';

/** Transform js object to iterable array.
 *  Example: 
 *  <span *ngFor="#entry of content | keys">           
 *      Key: {{entry.key}}, value: {{entry.value}}
 *  </span>
 */  
@Pipe({
  name: 'iterable',
  pure: false
})
export class IterablePipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (let key in value) {
      keys.push({
        key: key, 
        value: value[key]
      });
    }
    return keys;
  }
}