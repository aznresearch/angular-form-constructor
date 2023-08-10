import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormOptions } from 'src/app/models/form-constructor.model';
import { FormConstructorService } from 'src/app/services/form-constructor.service';
import { formOptionsMock } from 'src/app/constants/form-constants';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formOptions: FormOptions[] = formOptionsMock.formData;
  currentStep = 0;
  forms: FormGroup[] = [];
  // TODO затипизировать
  formContent: any[] = [];
  formFields: string[][] = [];
  formValue: any;
  country = 'NG';

  // formFieldsText: string = JSON.stringify(this.formOptions, null, 2);

  constructor(private formConstructorService: FormConstructorService) {}

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.addUniqueFormData();

    this.formOptions.forEach((formOption, i) => {
      this.formContent.push(formOption.data);
      this.formFields.push(
        Object.keys(this.formContent[i]).map((key) => ({ key, ...this.formContent[i][key] }))
      );
      this.forms.push(this.buildForm(this.formContent[i]));
    });
  }

  addUniqueFormData(): void {
    const index = formOptionsMock.uniqueFormData.findIndex(
      (formData) => formData.countryCode === this.country
    );
    if (index >= 0) {
      this.formOptions.splice(
        formOptionsMock.uniqueFormData[index].step,
        0,
        formOptionsMock.uniqueFormData[index]
      );
    }
  }

  buildForm(formContent: any): FormGroup {
    return this.formConstructorService.buildForm(formContent);
  }

  goToStep(step: string): void {
    this.currentStep = step === 'prev' ? --this.currentStep : ++this.currentStep;
  }

  onNextStep() {
    if (this.forms[this.currentStep].valid) {
      this.currentStep++;
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onPreviousStep() {
    this.currentStep--;
  }

  onSubmit() {
    if (this.forms[this.forms.length - 1].valid) {
      this.formValue = this.forms.reduce(
        (forms, currentForm) => ({ ...forms, ...currentForm.value }),
        {}
      );
    } else {
      throw new Error('ошибка введенных данных');
      this.markAllFieldsAsTouched();
    }
  }

  markAllFieldsAsTouched() {
    const currentFormGroup = this.forms[this.currentStep];
    Object.values(currentFormGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  // createFormFromText() {
  //   try {
  //     const parsedFormFields = JSON.parse(this.formFieldsText);
  //     if (Array.isArray(parsedFormFields)) {
  //       this.formOptions = parsedFormFields;
  //       this.form = this.buildForm();
  //     } else {
  //       console.log('Invalid formOptions format');
  //     }
  //   } catch (error) {
  //     console.log('Error parsing formOptions:', error);
  //   }
  // }
}
