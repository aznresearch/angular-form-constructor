import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { defaultFormOptionsObject } from '../../../../constants/form-constants';
import { defaultErrorMessages } from '../../../../constants/validator-constants';
import {
  FormField,
  FormOptionsFull,
  StepData,
  Validator
} from '../../../../models/form-constructor.model';
import { FormConstructorService } from '../../../../services/form-constructor.service';
import { FormDataService } from '../../../../services/form-data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  formOptionsFullObject: FormOptionsFull = defaultFormOptionsObject;
  formOptions: StepData[] = [];
  currentStep = 0;
  forms: FormGroup[] = [];
  formContent: FormField[][] = [];
  formValue: any;
  countryOptions: string[] = ['NG', 'GH'];
  country = '';
  formFieldsText = '';

  constructor(
    private formConstructorService: FormConstructorService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    this.initFormOptions();
    this.initForms(this.formOptions);
    this.initFormFieldsText();
  }

  initFormOptions() {
    this.formDataService.getFormData().subscribe((data) => {
      this.formOptionsFullObject = data;
    });

    this.formOptions = this.formOptionsFullObject.formData.steps;
  }

  initForms(formOptions: StepData[]) {
    this.formContent.length = 0;
    formOptions.forEach((formOption, i) => {
      this.formContent.push(formOption.addedFields);
      this.forms.push(this.buildForm(this.formContent[i]));
    });
  }

  initFormFieldsText() {
    this.formFieldsText = JSON.stringify(this.formOptionsFullObject, null, 2);
  }

  buildForm(formContent: FormField[]): FormGroup {
    return this.formConstructorService.buildForm(formContent);
  }

  getValidationMessage(formIndex: number, field: FormField): string | undefined {
    const formErrors = this.forms[formIndex].get(field.name)?.errors;
    const validators = field.validators;
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
}
