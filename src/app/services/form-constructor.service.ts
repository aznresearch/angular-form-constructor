import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormField } from '../models/form-constructor.model';

@Injectable({
  providedIn: 'root'
})
export class FormConstructorService {
  constructor(private fb: FormBuilder) {}

  buildForm(fields: FormField[]): FormGroup {
    const formGroup = this.fb.group({});
    fields.forEach((field) => {
      const { name, validators, options } = field;
      const formControl = this.fb.control('', this.getValidators(validators));
      formGroup.addControl(name, formControl);
    });
    return formGroup;
  }

  getValidators(validators: any[] = []): ValidatorFn[] {
    return validators
      .map((validator) => {
        if (validator.type === 'required') {
          return Validators.required;
        } else if (validator.type === 'minLength') {
          return Validators.minLength(validator.value);
        } else if (validator.type === 'pattern') {
          return Validators.pattern(validator.value);
        }
        return null;
      })
      .filter((validator) => validator !== null);
  }
}
