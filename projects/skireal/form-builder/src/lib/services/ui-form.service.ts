import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  FormField,
  Validator,
  Option,
  QeScale,
  QeScaleChild
} from '../models/form-constructor.model';
import { FormFieldType, booleanFields, controlsMap, fieldsByType } from '../constants/ui-constants';
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

  generateFormGroupConfig(
    addedFields: FormField[]
  ): Record<string, FormGroup | FormArray | FormControl> {
    const formGroupConfig: Record<string, FormGroup | FormArray | FormControl> = {};

    for (const field of addedFields) {
      formGroupConfig[field.id] = this.createControlForField(field);
    }
    return formGroupConfig;
  }

  createControlForField(field: FormField): FormGroup | FormArray | FormControl {
    if (field.isArray) {
      return this.createFormArray();
    } else if (field.isObject && field.objectFields) {
      return this.createFormGroupForObject(field.objectFields);
    } else {
      return this.createControl();
    }
  }

  createFormGroupForObject(objectFields: FormField[]): FormGroup {
    const formGroupConfig: Record<string, FormGroup | FormArray | FormControl> = {};

    for (const field of objectFields) {
      formGroupConfig[field.id] = this.createControlForField(field);
    }

    return this.fb.group(formGroupConfig);
  }

  createControl(): FormControl {
    return this.fb.control('');
  }

  createFormArray(): FormArray {
    return this.fb.array([]);
  }

  addControlToFormArray(
    formArray: FormArray,
    arrayName: string,
    nestedArrayConfig?: Record<string, FormControl | FormGroup | FormArray | string>
  ): void {
    const newGroup = this.createGroupForArray(
      arrayName,
      nestedArrayConfig as Record<string, FormControl | FormGroup | FormArray | string>
    );
    formArray.push(newGroup);
  }

  removeControlFromFormArray(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  createGroupForArray(
    arrayName: string,
    nestedArrayConfig?: Record<string, FormControl | FormGroup | FormArray | string>
  ): FormGroup {
    const group = this.fb.group({});
    const controlFields = controlsMap[arrayName] || [];
    if (controlFields) {
      controlFields.forEach((fieldName: string) => {
        if (nestedArrayConfig && fieldName in nestedArrayConfig) {
          group.addControl(fieldName, nestedArrayConfig[fieldName] as FormGroup | FormArray);
        } else {
          group.addControl(fieldName, this.createControl());
        }
      });
    } else {
      console.log(`Invalid controlName: ${arrayName}`);
    }

    return group;
  }

  saveFieldProperties(form: FormGroup, fieldType: string): FormField {
    const fieldOptions: FormField = {
      ...form.value,
      validators: form.value.validators?.filter((validator: Validator) =>
        Object.values(validator).some((property) => property !== '')
      ),
      type: fieldType,
      name: form.value.name || this.generateUniqueId().toString(),
      id: this.generateUniqueId().toString(),
      options: form.value.options?.map((option: Option) => ({
        ...option,
        id: this.generateUniqueId().toString()
      }))
    };

    booleanFields.forEach((field) => {
      if (typeof fieldOptions[field] !== 'boolean') {
        fieldOptions[field] = false;
      }
    });

    if (fieldType === 'nps' && form.value.comment) {
      const isCommentEmpty = Object.values(fieldOptions.comment || {}).every(
        (value) => value === '' || value === null || value === undefined
      );

      if (!isCommentEmpty) {
        fieldOptions.comment = {
          ...fieldOptions.comment,
          commentId: this.generateUniqueId().toString()
        };
      }
    }

    if (fieldType === 'qe' && form.value.qeScales) {
      fieldOptions.qeScales = form.value.qeScales.map((scale: QeScale) => ({
        ...scale,
        id: this.generateUniqueId().toString(),
        qeScaleChildren: scale.qeScaleChildren?.map((child: QeScaleChild) => ({
          ...child,
          id: this.generateUniqueId().toString()
        }))
      }));
    }

    return fieldOptions;
  }

  generateUniqueId(): string {
    return Math.floor(Math.random() * 100000000).toString();
  }

  setFieldsToCreate(fieldType: string): void {
    this.fieldsToCreate = fieldsByType[fieldType as FormFieldType];
    this.fieldsToCreateSubject.next(this.fieldsToCreate);
  }

  getFieldsToCreate(): Observable<FormField[]> {
    return this.fieldsToCreateSubject.asObservable();
  }
}
