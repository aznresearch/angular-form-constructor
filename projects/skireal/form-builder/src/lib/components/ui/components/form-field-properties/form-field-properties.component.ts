import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { validatorTypes, withoutValueValidatorTypes } from '../../../../constants/ui-constants';
import { FormField, Option } from '../../../../models/form-constructor.model';
import { UiFormService } from '../../../../services/ui-form.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-field-properties',
  templateUrl: './form-field-properties.component.html',
  styleUrls: ['./form-field-properties.component.scss']
})
export class FormFieldPropertiesComponent implements OnInit {
  @Input() propertyForm: FormGroup | undefined;
  @Input() selectedFieldType = '';
  @Input() enableSetValidationOptions = false;
  @Input() isEditFieldProperties = false;
  @Input() isSurvey = true;
  @Input() currentStep = 0;
  @Input() stepsLength = 1;

  validatorOptions = validatorTypes;
  fieldsToCreate: FormField[] = [];
  steps: number[] = [];
  isFieldVisible: Record<string, boolean> = {};

  constructor(private uiFormService: UiFormService) {}

  ngOnInit() {
    this.subscribeToFieldsToCreate();
    this.initializeSteps();
    this.initializeStepControl();
  }

  subscribeToFieldsToCreate() {
    this.uiFormService.getFieldsToCreate().subscribe((updatedFieldsToCreate) => {
      this.fieldsToCreate = updatedFieldsToCreate;
    });
  }

  addControlToFormArray(arrayName: string, parentArrayName?: string, index?: number) {
    const formArray = parentArrayName
      ? ((this.propertyForm?.get(parentArrayName) as FormArray)
          ?.at(index !== undefined ? index : -1)
          ?.get(arrayName) as FormArray)
      : (this.propertyForm?.get(arrayName) as FormArray);

    let nestedArrayConfig;
    if (this.fieldsToCreate.find((obj) => obj.id === arrayName)?.children) {
      nestedArrayConfig = this.uiFormService.generateFormGroupConfig(
        this.fieldsToCreate.find((obj) => obj.id === arrayName)?.children as FormField[]
      );
    }

    this.uiFormService.addControlToFormArray(formArray, arrayName, nestedArrayConfig);
  }

  removeControlFromFormArray(arrayName: string, index: number, parentArrayName?: string) {
    const formArray = parentArrayName
      ? (this.propertyForm?.get(parentArrayName)?.get(arrayName) as FormArray)
      : (this.propertyForm?.get(arrayName) as FormArray);
    this.uiFormService.removeControlFromFormArray(formArray, index);
  }

  showValueInput(validatorType: string): boolean {
    return !withoutValueValidatorTypes.includes(validatorType);
  }

  initializeSteps(): void {
    this.steps = Array.from({ length: this.stepsLength }, (_, i) => i);
  }

  initializeStepControl(): void {
    this.propertyForm?.get('step')?.setValue(this.currentStep);
  }

  toggleFieldVisibility(groupName: string): void {
    this.isFieldVisible[groupName] = !this.isFieldVisible[groupName];

    if (!this.isFieldVisible[groupName]) {
      this.resetFieldsInGroup(groupName);
    }
  }

  resetFieldsInGroup(groupName: string): void {
    const group = this.propertyForm?.get(groupName) as FormGroup;
    if (group) {
      group.reset();
    }
  }

  hasValueInGroup(groupName: string): boolean {
    const group = this.propertyForm?.get(groupName) as FormGroup;
    return group ? Object.values(group.controls).some((control) => control.value) : false;
  }

  shouldShowFields(groupName: string): boolean {
    if (this.hasValueInGroup(groupName)) {
      this.isFieldVisible[groupName] = true;
    }
    return this.isFieldVisible[groupName];
  }

  onDrop(event: CdkDragDrop<Option[]>) {
    const formArray = event.container.data;
    moveItemInArray(formArray, event.previousIndex, event.currentIndex);
    const formGroupArray = this.propertyForm?.get('options') as FormArray;
    const reorderedValues = formGroupArray.controls.map((control) => control.value);
    formGroupArray.setValue(reorderedValues);
  }
}
