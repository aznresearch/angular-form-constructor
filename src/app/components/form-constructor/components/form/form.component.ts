import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { defaultErrorMessages } from 'src/app/constants/validator-constants';
import {
  FormField,
  FormOptions,
  FormOptionsMock,
  Validator
} from 'src/app/models/form-constructor.model';
import { FormConstructorService } from 'src/app/services/form-constructor.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  formOptionsFullObject!: FormOptionsMock;
  formOptions!: FormOptions[];
  currentStep!: number;
  forms!: FormGroup[];
  formContent!: { [key: string]: FormField }[];
  formFields!: FormField[][];
  formValue: any;

  countryOptions: string[] = ['NG', 'GH'];
  country = '';

  formFieldsText!: string;

  constructor(private formConstructorService: FormConstructorService) {}

  ngOnInit() {
    this.initFormOptions();
    this.initForms(this.formOptions);
    this.initFormFieldsText();
  }

  initFormOptions() {
    this.formConstructorService.getFormOptions().subscribe((formOptionsFull) => {
      this.formOptionsFullObject = formOptionsFull;
    });
    this.formOptions = this.formOptionsFullObject.formData;
  }

  initForms(formOptions: FormOptions[]) {
    this.currentStep = 0;
    this.forms = [];
    this.formContent = [];
    this.formFields = [];

    this.addUniqueFormData();
    formOptions.forEach((formOption, i) => {
      this.formContent.push(formOption.data);
      const fieldNames = Object.keys(this.formContent[i]);
      const fieldObjects = fieldNames.map((key) => ({ key, ...this.formContent[i][key] }));
      this.formFields.push(fieldObjects);
      this.forms.push(this.buildForm(this.formContent[i]));
    });
  }

  initFormFieldsText() {
    this.formFieldsText = JSON.stringify(this.formOptionsFullObject, null, 2);
  }

  buildForm(formContent: any): FormGroup {
    return this.formConstructorService.buildForm(formContent);
  }

  addUniqueFormData(): void {
    if (this.formOptionsFullObject.uniqueFormData !== undefined) {
      const index = this.formOptionsFullObject.uniqueFormData.findIndex(
        (formData) => formData.countryCode === this.country
      );
      if (index >= 0) {
        this.formOptions.splice(
          this.formOptionsFullObject.uniqueFormData[index].step,
          0,
          this.formOptionsFullObject.uniqueFormData[index]
        );
      }
    }
  }

  getValidationMessage(formIndex: number, formFieldName: string): string | undefined {
    const formErrors = this.forms[formIndex].get(formFieldName)?.errors;
    const validators = this.formContent[formIndex][formFieldName].validators;
    if (formErrors && validators) {
      const validator = validators.find(
        (item: Validator) => item.type === Object.keys(formErrors)[0]
      );
      const errorMessage = validator?.errormsg;
      const defaultErrorMessage = defaultErrorMessages[Object.keys(formErrors)[0]];
      return errorMessage || defaultErrorMessage;
    }
    return undefined;
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
    if (this.isLastStepValid()) {
      this.formValue = this.collectFormValues();
      this.formConstructorService.setFormValue(this.formValue);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  isLastStepValid(): boolean {
    return this.forms[this.forms.length - 1].valid;
  }

  collectFormValues(): any {
    return this.forms.reduce((forms, currentForm) => ({ ...forms, ...currentForm.value }), {});
  }

  markAllFieldsAsTouched() {
    const currentFormGroup = this.forms[this.currentStep];
    Object.values(currentFormGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  isFieldInvalid(form: FormGroup, formFieldName: string): boolean | undefined {
    const control = form.get(formFieldName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  createFormFromText() {
    try {
      const parsedFormFields = JSON.parse(this.formFieldsText);
      const parsedFormFieldsOptions = parsedFormFields.formData;
      if (Array.isArray(parsedFormFieldsOptions)) {
        this.formOptions = parsedFormFieldsOptions;
        this.initForms(this.formOptions);
      } else {
        console.log('Invalid formOptions format');
      }
    } catch (error) {
      console.log('Error parsing formOptions:', error);
    }
  }
}