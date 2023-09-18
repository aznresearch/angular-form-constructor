import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormField, Validator } from '../models/form-constructor.model';
import { FormFieldType, controlsMap, fieldsByType } from '../constants/ui-constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiFormService {
  private fieldsToCreate: FormField[] = [];
  private fieldsToCreateSubject = new BehaviorSubject<FormField[]>(this.fieldsToCreate);

  constructor(private fb: FormBuilder) {}

  createFormGroup(addedFields: FormField[]): FormGroup {
    const formGroupConfig = this.generateFormGroupConfig(addedFields);
    return this.fb.group(formGroupConfig);
  }

  generateFormGroupConfig(addedFields: FormField[]): Record<string, FormArray | string> {
    const formGroupConfig: Record<string, FormArray | string> = {};

    for (const field of addedFields) {
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

  addControlToFormArray(formArray: FormArray, arrayName: string): void {
    const newGroup = this.createGroupForArray(arrayName);
    formArray.push(newGroup);
  }

  removeControlFromFormArray(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
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

  setFieldsToCreate(fieldType: string): void {
    if (fieldType !== 'all-fields') {
      this.fieldsToCreate = fieldsByType[fieldType as FormFieldType];
    } else {
      this.fieldsToCreate = fieldsByType[FormFieldType.AllFields];
    }

    this.fieldsToCreateSubject.next(this.fieldsToCreate);
  }

  getFieldsToCreate(): Observable<FormField[]> {
    return this.fieldsToCreateSubject.asObservable();
  }
}
