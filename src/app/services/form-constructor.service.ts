import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormConstructorService {
  constructor(private fb: FormBuilder) {}

  buildForm(formFields: any): FormGroup {
    const formGroup = this.fb.group({});
    for (const key of Object.keys(formFields)) {
      let initialValue: any = '';
      if (formFields[key].type === 'checkbox') {
        initialValue = false;
      }
      const field = formFields[key];
      const formControl = this.fb.control(initialValue, this.getValidators(field.validators));
      formGroup.addControl(key, formControl);
    }
    return formGroup;
  }

  getValidators(validators: any[] = []): ValidatorFn[] {
    const validatorMap: Record<string, (value: any) => ValidatorFn> = {
      required: () => Validators.required,
      minlength: (value: number) => Validators.minLength(value),
      maxlength: (value: number) => Validators.maxLength(value),
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
