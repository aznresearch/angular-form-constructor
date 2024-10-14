import { Injectable } from '@angular/core';
import { FormField, FormOptionsFull } from '../models/form-constructor.model';
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

  prepareFormData(formData: FormOptionsFull): FormOptionsFull {
    const formOptionsFullObject: FormOptionsFull = formData;
    const formDataSteps = formData.formData.steps;

    formDataSteps.forEach((stepFormData, index) => {
      const stepData: FormField[] = [];

      stepFormData.addedFields.forEach((field) => {
        const fieldData: FormField = { ...field };

        if ('step' in fieldData) {
          delete fieldData.step;
        }

        if (fieldData.type === 'need-contact') {
          delete fieldData.options;
        }

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

      formOptionsFullObject.formData.steps[index] = {
        title: `Step ${index + 1}`,
        addedFields: stepData,
        conditionalLogicBlocks: stepFormData.conditionalLogicBlocks
      };
    });

    return formOptionsFullObject;
  }
}
