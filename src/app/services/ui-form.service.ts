import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormField, Validator } from '../models/form-constructor.model';
import { controlsMap } from '../constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class UiFormService {
  constructor(private fb: FormBuilder) {}

  createFormGroup(addedFields: FormField[]): FormGroup {
    const formGroupConfig = this.generateFormGroupConfig(addedFields);
    return this.fb.group(formGroupConfig);
  }

  generateFormGroupConfig(addedFields: FormField[]): Record<string, FormArray | string> {
    const formGroupConfig: Record<string, FormArray | string> = {};

    for (const field of addedFields) {
      console.log(field);

      if (field.isArray) {
        formGroupConfig[field.id] = this.createFormArray();
      } else {
        formGroupConfig[field.id] = '';
      }
    }

    return formGroupConfig;
  }

  createControl(): FormControl {
    return this.fb.control('');
  }

  createFormArray(): FormArray {
    return this.fb.array([]);
  }

  createGroupForArray(arrayName: string): FormGroup {
    const group = this.fb.group({});
    const controlFields = controlsMap[arrayName];
    if (controlFields) {
      controlFields.forEach((fieldName: string) => {
        group.addControl(fieldName, this.createControl());
      });
    } else {
      console.log(`Invalid controlName: ${arrayName}`);
    }
    return group;
  }

  saveFieldProperties(form: FormGroup, fieldType: string): FormField {
    const fieldOptions = form.value;
    fieldOptions.validators = fieldOptions.validators.filter((validator: Validator) => {
      return Object.values(validator).some((property) => property !== '');
    });
    fieldOptions.type = fieldType;
    fieldOptions.name = fieldOptions.name || this.generateUniqueId().toString();
    fieldOptions.id = this.generateUniqueId().toString();
    return fieldOptions;
  }

  generateUniqueId(): string {
    return Math.floor(Math.random() * 100000000).toString();
  }
}
