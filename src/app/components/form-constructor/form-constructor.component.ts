import { ValidatorKeys } from '../../constants/validator-constants';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField } from 'src/app/models/form-constructor.model';
import { FormConstructorService } from 'src/app/services/form-constructor.service';
import { formMock } from 'src/app/constants/form-constants';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  form: FormGroup;
  formFields: FormField[] = formMock as FormField[];

  formFieldsText: string = JSON.stringify(this.formFields, null, 2);
  errorKeys = ValidatorKeys;

  constructor(private formConstructorService: FormConstructorService) {}

  ngOnInit() {
    this.form = this.formConstructorService.buildForm(this.formFields);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  markAllFieldsAsTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  createFormFromText() {
    try {
      const parsedFormFields = JSON.parse(this.formFieldsText);
      if (Array.isArray(parsedFormFields)) {
        this.formFields = parsedFormFields;
        this.form = this.formConstructorService.buildForm(this.formFields);
      } else {
        console.log('Invalid formFields format');
      }
    } catch (error) {
      console.log('Error parsing formFields:', error);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field.invalid && field.touched;
  }
}
