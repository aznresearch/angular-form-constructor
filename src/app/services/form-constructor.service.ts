import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormField } from '../models/form-constructor.model';

@Injectable({
  providedIn: 'root'
})
export class FormConstructorService {
  private formValueSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private fb: FormBuilder) {}

  buildForm(formFields: FormField[]): FormGroup {
    const formGroup = this.fb.group({});
    for (const field of formFields) {
      const fieldFormGroup = this.createFieldFormGroup(field);
      formGroup.addControl(field.name, fieldFormGroup);
    }
    return formGroup;
  }

  createFieldFormGroup(field: FormField): AbstractControl {
    if (field.type === 'checkbox-group') {
      return this.createCheckboxFormGroup(field);
    } else if (field.type === 'likert') {
      return this.createLikertFormGroup(field);
    } else if (field.type === 'nps') {
      return this.createNpsFormGroup(field);
    } else {
      return this.createDefaultFormControl(field);
    }
  }

  createCheckboxFormGroup(field: FormField): FormGroup {
    const checkboxFormGroup = this.fb.group({});
    if (field.options) {
      for (const option of field.options) {
        const checkboxControl = this.fb.control(false, this.getValidators(field.validators));
        checkboxFormGroup.addControl(option.name, checkboxControl);
      }
    }
    return checkboxFormGroup;
  }

  createLikertFormGroup(field: FormField): FormGroup {
    const likertFormGroup = this.fb.group({});
    if (field.rows && field.rows.length > 0) {
      for (const row of field.rows) {
        const rowControl = this.fb.control('', this.getValidators(field.validators));
        likertFormGroup.addControl(field.name + row.name, rowControl);
      }
    }
    return likertFormGroup;
  }

  createNpsFormGroup(field: FormField): FormGroup {
    const npsFormGroup = this.fb.group({});
    const valueControl = this.fb.control('', this.getValidators(field.validators));
    npsFormGroup.addControl(field.name + '-value', valueControl);
    const commentControl = this.fb.control('', this.getValidators(field.validators));
    npsFormGroup.addControl(field.name + '-comment', commentControl);
    return npsFormGroup;
  }

  createDefaultFormControl(field: FormField): FormControl {
    let initialValue: any = '';
    if (field.type === 'checkbox') {
      initialValue = false;
    }

    if (field.initial !== undefined) {
      initialValue = field.initial;
    }
    return this.fb.control(initialValue, this.getValidators(field.validators));
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
