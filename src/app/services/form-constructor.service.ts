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
    const validatorMap: Record<string, (value: any) => ValidatorFn> = {
      required: () => Validators.required,
      minLength: (value: number) => Validators.minLength(value),
      maxLength: (value: number) => Validators.maxLength(value),
      pattern: (value: string | RegExp) => Validators.pattern(value),
      email: () => Validators.email,
      min: (value: number) => Validators.min(value),
      max: (value: number) => Validators.max(value),
      nullValidator: () => Validators.nullValidator,
      requiredTrue: () => Validators.requiredTrue
    };

    return validators
      .map((validator) => validatorMap[validator.type]?.(validator.value))
      .filter((validator) => validator !== null);
  }
}
