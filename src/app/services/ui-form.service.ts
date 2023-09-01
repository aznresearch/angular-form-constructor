import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldsToCreate } from '../models/ui-form.model';
import { FormField, Validator } from '../models/form-constructor.model';
import { controlsMap } from '../constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class UiFormService {
  constructor(private fb: FormBuilder) {}

  createPropertyForm(fieldsToCreate: FieldsToCreate[]): FormGroup {
    const formGroupConfig: { [key: string]: FormArray | string } = {};

    for (const field of fieldsToCreate) {
      if (field.isArray) {
        formGroupConfig[field.name] = this.createFormArray();
      } else {
        formGroupConfig[field.name] = '';
      }
    }

    return this.fb.group(formGroupConfig);
  }

  createControl(): FormControl {
    return this.fb.control('');
  }

  createFormArray(): FormArray {
    return this.fb.array([]);
  }

  createGroup(controlName: string): FormGroup {
    const group = this.fb.group({});

    const controlFields = controlsMap[controlName];

    if (controlFields) {
      controlFields.forEach((fieldName: string) => {
        group.addControl(fieldName, this.createControl());
      });
    } else {
      console.log(`Invalid controlName: ${controlName}`);
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
