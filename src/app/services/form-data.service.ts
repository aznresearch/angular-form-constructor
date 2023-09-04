import { Injectable } from '@angular/core';
import { StepData } from '../models/form-constructor.model';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData: StepData[] = [];

  setFormData(data: StepData[]) {
    this.formData = data;
  }

  getFormData(): StepData[] {
    return this.formData;
  }
}
