import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { validatorTypes } from 'src/app/constants/ui-constants';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-form-field-properties',
  templateUrl: './form-field-properties.component.html',
  styleUrls: ['./form-field-properties.component.scss']
})
export class FormFieldPropertiesComponent implements OnInit {
  @Input() propertyForm?: FormGroup;

  validatorOptions = validatorTypes;

  constructor(private uiFormService: UiFormService) {}

  ngOnInit(): void {}

  addControlToFormArray(arrayName: string): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    const newGroup = this.uiFormService.createGroup(arrayName);
    formArray.push(newGroup);
  }

  removeControlFromFormArray(arrayName: string, index: number): void {
    const formArray = this.propertyForm?.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }
}
