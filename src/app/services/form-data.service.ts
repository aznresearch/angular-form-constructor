import { Injectable } from '@angular/core';
import { FormField, FormOptionsFull, StepData } from '../models/form-constructor.model';
import { defaultFormOptionsObject } from '../constants/form-constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formOptionsFull: BehaviorSubject<FormOptionsFull> = new BehaviorSubject<FormOptionsFull>(
    defaultFormOptionsObject
  );

  setFormData(data: FormOptionsFull) {
    this.formOptionsFull.next(data);
  }

  getFormData(): Observable<FormOptionsFull> {
    return this.formOptionsFull.asObservable();
  }

  prepareFormData(formData: StepData[]): FormOptionsFull {
    const formOptionsFullObject: FormOptionsFull = defaultFormOptionsObject;

    formData.forEach((stepFormData, index) => {
      const stepData: FormField[] = [];
      stepFormData.addedFields.forEach((field) => {
        const fieldData: FormField = {
          id: field.id,
          name: field.name,
          type: field.type,
          title: field.title,
          validators: field.validators,
          classes: field.classes,
          options: field.options
        };

        const hasNonRequiredValidator = field.validators?.some(
          (validator) => validator.type !== 'required'
        );
        const hasRequiredValidator = field.validators?.some(
          (validator) => validator.type === 'required'
        );

        if (hasNonRequiredValidator && !hasRequiredValidator) {
          fieldData.validators?.push({
            type: 'required',
            errormsg: 'This field is required'
          });
        }

        stepData.push(fieldData);
      });

      formOptionsFullObject.formData[index] = {
        title: `Step ${index + 1}`,
        data: stepData,
        conditionalLogicBlocks: stepFormData.conditionalLogicBlocks
      };
    });

    return formOptionsFullObject;
  }
}
