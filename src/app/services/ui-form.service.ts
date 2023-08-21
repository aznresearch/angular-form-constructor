import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UiFormService {
  constructor(private fb: FormBuilder) {}

  createPropertyForm(): FormGroup {
    return this.fb.group({
      name: '',
      validators: '',
      classes: '',
      placeholder: '',
      label: ''
    });
  }

  saveFieldProperties(form: FormGroup, fieldType: string): any {
    const fieldOptions = form.value;
    fieldOptions.type = fieldType;
    fieldOptions.name = fieldOptions.name || this.generateUniqueId().toString();
    fieldOptions.id = this.generateUniqueId().toString();
    return fieldOptions;
  }

  generateUniqueId(): number {
    return Math.floor(Math.random() * 100000000);
  }
}
