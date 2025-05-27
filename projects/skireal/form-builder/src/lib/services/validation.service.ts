import { Injectable } from '@angular/core';
import { FormFieldType, fieldsByType, commonFields } from '../constants/ui-constants';
import { Field } from '../models/form-constructor.model';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private localeService: LocaleService) {}

  getMissingFieldsMessage(missingFields: string[], fieldType: FormFieldType): string {
    const localizedMessage =
      this.localeService.getCurrentLocale()['Please fill in all required fields'] ||
      'Please fill in all required fields';

    const readableNames = missingFields.map((fieldId) => this.getFieldNameById(fieldId, fieldType));

    return `${localizedMessage}: ${readableNames.join(', ')}`;
  }

  getFieldNameById(fieldId: string, fieldType: FormFieldType): string {
    const allFields: Field[] = [...commonFields, ...(fieldsByType[fieldType] || [])];

    const found = allFields.find((f) => f.id === fieldId);
    return found?.name || fieldId;
  }
}
