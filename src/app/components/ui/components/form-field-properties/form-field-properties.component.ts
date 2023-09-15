import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import {
  validatorTypes,
  haveOptionsFieldTypes,
  withoutValueValidatorTypes
} from 'src/app/constants/ui-constants';
import { FormField } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-form-field-properties',
  templateUrl: './form-field-properties.component.html',
  styleUrls: ['./form-field-properties.component.scss']
})
export class FormFieldPropertiesComponent implements OnInit {
  @Input() propertyForm: FormGroup | undefined;
  @Input() selectedFieldType = '';

  validatorOptions = validatorTypes;
  fieldsToCreate: FormField[] = [];

  constructor(private uiFormService: UiFormService) {}

  ngOnInit(): void {
    this.subscribeToFieldsToCreate();
  }

  subscribeToFieldsToCreate(): void {
    this.uiFormService.getFieldsToCreate().subscribe((updatedFieldsToCreate) => {
      this.fieldsToCreate = updatedFieldsToCreate;
    });
  }

  addControlToFormArray(arrayName: string): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    this.uiFormService.addControlToFormArray(formArray, arrayName);
  }

  removeControlFromFormArray(arrayName: string, index: number): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    this.uiFormService.removeControlFromFormArray(formArray, index);
  }

  shouldShowOptions(): boolean {
    return haveOptionsFieldTypes.includes(this.selectedFieldType);
  }

  showValueInput(validatorType: string): boolean {
    return !withoutValueValidatorTypes.includes(validatorType);
  }
}
