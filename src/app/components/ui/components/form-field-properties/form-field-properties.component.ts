import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { validatorTypes, fieldsToCreate } from 'src/app/constants/ui-constants';
import { FormField } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-form-field-properties',
  templateUrl: './form-field-properties.component.html',
  styleUrls: ['./form-field-properties.component.scss']
})
export class FormFieldPropertiesComponent implements OnInit {
  @Input() propertyForm?: FormGroup;
  @Input() selectedFieldType = '';

  validatorOptions = validatorTypes;
  fieldsToCreate: FormField[] = fieldsToCreate;

  constructor(private uiFormService: UiFormService) {}

  ngOnInit(): void {}

  addControlToFormArray(arrayName: string): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    const newGroup = this.uiFormService.createGroupForArray(arrayName);
    formArray.push(newGroup);
  }

  removeControlFromFormArray(arrayName: string, index: number): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }

  shouldShowOptions(): boolean {
    const haveOptionsFieldTypes = ['select', 'checkbox', 'radio'];
    return haveOptionsFieldTypes.includes(this.selectedFieldType);
  }

  showValueInput(validatorType: string): boolean {
    const withoutValueValidatorTypes = ['required', 'requiredTrue', 'email'];
    return !withoutValueValidatorTypes.includes(validatorType);
  }
}
