import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UiFormService {
  constructor(private fb: FormBuilder) {}

  createPropertyForm(): FormGroup {
    return this.fb.group({
      name: '',
      classes: '',
      placeholder: '',
      label: '',
      validators: this.createFormArray(),
      options: this.createFormArray()
    });
  }

  createControl(): FormControl {
    return this.fb.control('');
  }

  createFormArray(): FormArray {
    return this.fb.array([]);
  }

  createGroup(controlName: string): FormGroup {
    const group = this.fb.group({});

    if (controlName === 'validators') {
      group.addControl('type', this.createControl());
      group.addControl('value', this.createControl());
      group.addControl('errormsg', this.createControl());
    } else if (controlName === 'options') {
      group.addControl('name', this.createControl());
      group.addControl('value', this.createControl());
    }

    return group;
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
