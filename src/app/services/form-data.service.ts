import { Injectable } from '@angular/core';
import { FormField, FormOptionsFull, StepData } from '../models/form-constructor.model';
import { defaultFormOptionsObject } from '../constants/form-constants';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formOptionsFull: FormOptionsFull = defaultFormOptionsObject;

  setFormData(data: FormOptionsFull) {
    this.formOptionsFull = data;
  }

  getFormData(): FormOptionsFull {
    return this.formOptionsFull;
  }

  prepareFormData(formData: StepData[]): FormOptionsFull {
    const formOptionsFullObject: FormOptionsFull = defaultFormOptionsObject;

    formData.forEach((stepFormData, index) => {
      const stepData: Record<string, FormField> = {};

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
        stepData[field.name] = fieldData;
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