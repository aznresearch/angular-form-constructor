import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormField, Option } from '../models/form-constructor.model';

@Injectable({
  providedIn: 'root'
})
export class FormConstructorService {
  private formValueSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private fb: FormBuilder) {}

  buildForm(formFields: FormField[]): FormGroup {
    const formGroup = this.fb.group({});

    for (const field of formFields) {
      let initialValue: any = '';

      if (field.type === 'checkbox') {
        initialValue = false;
      }
      if (field.type === 'checkbox-group' && field.options) {
        const checkboxArray = this.createCheckboxArray(field.options);
        formGroup.addControl(field.name, checkboxArray);
      }

      if (field.initial !== undefined) {
        initialValue = field.initial;
      }

      const formControl = this.fb.control(initialValue, this.getValidators(field.validators));
      formGroup.addControl(field.name, formControl);
    }

    return formGroup;
  }

  createCheckboxArray(options: Option[]): FormArray {
    const checkboxArray = this.fb.array([]);
    for (const _ of options) {
      const checkboxControl = this.fb.control(false);
      checkboxArray.push(checkboxControl);
    }
    return checkboxArray;
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

  setFormValue(formData: any) {
    this.formValueSubject.next(formData);
  }

  getFormValue() {
    return this.formValueSubject.asObservable();
  }
}
