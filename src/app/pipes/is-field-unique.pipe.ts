import { Pipe, PipeTransform } from '@angular/core';
import { FormFieldType, uniqueFieldTypes } from '../constants/ui-constants';

@Pipe({
  name: 'isFieldUnique',
  pure: true
})
export class IsFieldUniquePipe implements PipeTransform {
  transform(fieldType: FormFieldType): boolean {
    return uniqueFieldTypes.includes(fieldType);
  }
}
