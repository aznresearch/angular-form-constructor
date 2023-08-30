import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldsToCreate } from '../models/ui-form.model';
import { FormField, Validator } from '../models/form-constructor.model';

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

    if (controlName === 'validators') {
      group.addControl('type', this.createControl());
      group.addControl('value', this.createControl());
      group.addControl('errormsg', this.createControl());
    } else if (controlName === 'options') {
      group.addControl('name', this.createControl());
      group.addControl('value', this.createControl());
    } else if (controlName === 'conditionalLogicBlocks') {
      group.addControl('selectedField', this.createControl());
      group.addControl('selectedCondition', this.createControl());
      group.addControl('conditionValue', this.createControl());
      group.addControl('selectedAction', this.createControl());
      group.addControl('selectedTargetField', this.createControl());
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

  generateUniqueId(): number {
    return Math.floor(Math.random() * 100000000);
  }
}
