import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

/** Transform js object to iterable array.
 *  Example: 
 *  <span *ngFor="#entry of content | keys">           
 *      key: {{entry.key}}, value: {{entry.value}}
 *  </span>
 */  
@Pipe({
  name: "iterable",
  pure: false
})
export class IterablePipe implements PipeTransform {
  transform(dictionary: _.Dictionary<any>, args: string[]): any {
    return _.map(dictionary, (value, key) => {
        return {
          key: key, 
          value: value
        };
    })
  }
}