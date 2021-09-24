import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectInfo'
})
export class ObjectInfoPipe implements PipeTransform {

  transform(value: any, ...fieldNames: string[]): string {
    if (!value || !fieldNames ) { return "Unkonown"}

    if (fieldNames.length==0) {
      fieldNames = Object.keys(value);
    }

    let text = '';

    fieldNames.forEach(fieldName => { text+= ' ' + value[fieldName]})
    return text;
  }

}
