import { Injectable } from '@angular/core';
import { FormDataStructure, FormField, FormOptionsFull } from '../models/form-constructor.model';
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

  prepareFormData(formData: FormDataStructure): FormOptionsFull {
    const formOptionsFullObject: FormOptionsFull = defaultFormOptionsObject;
    formOptionsFullObject.formData.generalFields = formData.generalFields;
    const formDataSteps = formData.steps;

    formDataSteps.forEach((stepFormData, index) => {
      const stepData: FormField[] = [];

      stepFormData.addedFields.forEach((field) => {
        const fieldData: FormField = field;

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

        if (
          field.type === 'textarea' &&
          !fieldData.validators?.some((validator) => validator.type === 'maxlength')
        ) {
          fieldData.validators?.push({
            type: 'maxlength',
            value: 1000,
            errormsg: 'Text is too long'
          });
        }

        stepData.push(fieldData);
      });

      formOptionsFullObject.formData.steps[index] = {
        title: `Step ${index + 1}`,
        addedFields: stepData,
        conditionalLogicBlocks: stepFormData.conditionalLogicBlocks
      };
    });

    return formOptionsFullObject;
  }
}
