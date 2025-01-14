import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ConditionalLogicBlock,
  FormField,
  FormOptionsFull
} from '../../models/form-constructor.model';
import {
  FieldTypesNames,
  FormFieldType,
  defaultConditionalLogicBlock,
  fieldTypesNames,
  uniqueFieldTypes
} from '../../constants/ui-constants';
import { UiFormService } from '../../services/ui-form.service';
import { FormDataService } from '../../services/form-data.service';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  @Input() enableGeneralFields = true;
  @Input() enableConditionalLogicBlocks = false;
  @Input() isSurvey = true;
  @Input() incomingFormData: FormOptionsFull = {
    formData: {
      steps: [],
      generalFields: []
    },
    options: {
      name: '',
      type: '',
      country: ''
    },
    uniqueFormData: []
  };
  @Input() enableSetValidationOptions = false;

  @Output() saveClicked: EventEmitter<FormOptionsFull> = new EventEmitter<FormOptionsFull>();

  dynamicForm!: FormGroup;
  generalForm!: FormGroup;
  formData: FormOptionsFull = {
    formData: {
      steps: [],
      generalFields: []
    },
    options: {
      name: '',
      type: '',
      country: ''
    },
    uniqueFormData: []
  };
  addedFields: FormField[] = [];
  generalFields: FormField[] = [];
  conditionalLogicBlocks: ConditionalLogicBlock[] = [];
  fieldLabels: FieldTypesNames = fieldTypesNames;
  currentStep = 0;
  usedFieldTypes: FormFieldType[] = [];
  isSidebarOpen = false;
  isFieldsInsertingOpen = false;
  isFieldPropertiesOpen = false;
  isGeneral = false;
  fieldToEdit: FormField = { id: '', name: '' };

  constructor(
    private uiFormService: UiFormService,
    private formDataService: FormDataService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.insertFormData();
    this.createForm();
  }

  createForm() {
    this.dynamicForm = this.uiFormService.createFormGroup(this.addedFields);
    if (this.enableGeneralFields) {
      this.generalForm = this.uiFormService.createFormGroup(this.generalFields);
    }
  }

  removeField(field: FormField, isGeneral: boolean) {
    let fieldsArray: FormField[];
    let formGroup: FormGroup;

    if (isGeneral) {
      fieldsArray = this.generalFields;
      formGroup = this.generalForm;
    } else {
      fieldsArray = this.addedFields;
      formGroup = this.dynamicForm;
    }

    const index = fieldsArray.indexOf(field);
    if (index !== -1) {
      fieldsArray.splice(index, 1);
      formGroup.removeControl(field.id);
    }

    if (this.isFieldUnique(field.type as FormFieldType)) {
      const typeIndex = this.usedFieldTypes.indexOf(field.type as FormFieldType);
      if (typeIndex !== -1) {
        this.usedFieldTypes.splice(typeIndex, 1);
      }
    }

    this.saveCurrentStepData();
  }

  copyField(field: FormField, isGeneral: boolean) {
    let fieldsArray: FormField[];
    let formGroup: FormGroup;

    if (isGeneral) {
      fieldsArray = this.generalFields;
      formGroup = this.generalForm;
    } else {
      fieldsArray = this.addedFields;
      formGroup = this.dynamicForm;
    }
    const copiedField = { ...field };
    copiedField.id = this.uiFormService.generateUniqueId();
    const originalFieldIndex = fieldsArray.indexOf(field);
    fieldsArray.splice(originalFieldIndex + 1, 0, copiedField);
    const newFormControl = this.uiFormService.createControl();
    formGroup.addControl(copiedField.id, newFormControl);
    this.saveCurrentStepData();
  }

  insertConditionalLogicBlock() {
    const newBlock: ConditionalLogicBlock = defaultConditionalLogicBlock;
    this.conditionalLogicBlocks.push(newBlock);
    this.saveCurrentStepData();
  }

  removeConditionalLogicBlock(index: number) {
    this.conditionalLogicBlocks.splice(index, 1);
    this.saveCurrentStepData();
  }

  goToStep(step: number) {
    this.currentStep = step;

    if (!this.formData.formData.steps[this.currentStep]) {
      this.formData.formData.steps[this.currentStep] = {
        addedFields: [],
        conditionalLogicBlocks: []
      };
    }

    this.updateStep();
  }

  goToNextStep() {
    this.saveCurrentStepData();
    this.currentStep++;
    this.goToStep(this.currentStep);
  }

  goToPreviousStep() {
    if (this.currentStep > 0) {
      this.saveCurrentStepData();
      this.currentStep--;
      this.goToStep(this.currentStep);
    }
  }

  saveCurrentStepData() {
    this.formData.formData.generalFields = [...this.generalFields];
    this.formData.formData.steps[this.currentStep] = {
      addedFields: [...this.addedFields],
      conditionalLogicBlocks: [...this.conditionalLogicBlocks]
    };
  }

  insertFormData() {
    const incomingFormData = this.incomingFormData;

    if (incomingFormData) {
      this.formData = incomingFormData;
    } else {
      this.formData = {
        formData: {
          steps: [],
          generalFields: []
        },
        options: {
          name: '',
          type: '',
          country: ''
        },
        uniqueFormData: []
      };
    }

    this.addedFields = this.formData.formData.steps[this.currentStep]?.addedFields ?? [];
    this.generalFields = this.formData.formData.generalFields ?? [];
    this.conditionalLogicBlocks =
      this.formData.formData.steps[this.currentStep]?.conditionalLogicBlocks ?? [];
  }

  saveForm() {
    this.saveCurrentStepData();
    const payload = this.formDataService.prepareFormData(this.formData);
    this.formDataService.setFormData(payload);
    this.saveClicked.emit(payload);
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    const formArray = event.container.data;
    moveItemInArray(formArray, event.previousIndex, event.currentIndex);
    this.saveCurrentStepData();
  }

  copyStep(index: number) {
    const copiedStep = { ...this.formData.formData.steps[index] };
    copiedStep.addedFields = copiedStep.addedFields.map((field) => ({
      ...field,
      id: this.uiFormService.generateUniqueId()
    }));

    this.formData.formData.steps.splice(index + 1, 0, copiedStep);
    this.goToStep(index + 1);
    this.saveCurrentStepData();
  }

  moveStep(index: number, direction: 'next' | 'prev') {
    if (direction === 'next') {
      [this.formData.formData.steps[index], this.formData.formData.steps[index + 1]] = [
        this.formData.formData.steps[index + 1],
        this.formData.formData.steps[index]
      ];
    } else if (direction === 'prev') {
      [this.formData.formData.steps[index], this.formData.formData.steps[index - 1]] = [
        this.formData.formData.steps[index - 1],
        this.formData.formData.steps[index]
      ];
    }

    this.goToStep(index);
    this.saveCurrentStepData();
  }

  deleteStepConfirmation(index: number) {
    this.confirmationService.open('Are you sure you want to delete this step?').then((result) => {
      if (result) {
        this.deleteStep(index);
      }
    });
  }

  deleteStep(index: number) {
    this.formData.formData.steps.splice(index, 1);
    if (this.currentStep >= index) {
      this.currentStep = this.currentStep > 0 ? this.currentStep - 1 : 0;
    }

    if (this.formData.formData.steps.length > 0) {
      this.updateStep();
    } else {
      this.addedFields = [];
      this.conditionalLogicBlocks = [];
      this.createForm();
    }
    this.saveCurrentStepData();
  }

  updateStep() {
    this.addedFields = this.formData.formData.steps[this.currentStep].addedFields;
    this.conditionalLogicBlocks =
      this.formData.formData.steps[this.currentStep].conditionalLogicBlocks;
    this.createForm();
  }

  isFieldUnique(fieldType: FormFieldType): boolean {
    return uniqueFieldTypes.includes(fieldType);
  }

  getValuesForCsat(field: FormField): (number | string)[] {
    const values: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (field.hasNA) {
      values.push('N/A');
    }
    return values;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleFieldsInsertingSidebar(isGeneral: boolean = false): void {
    this.isFieldsInsertingOpen = !this.isFieldsInsertingOpen;
    this.isFieldPropertiesOpen = false;
    this.isGeneral = isGeneral;
    this.toggleSidebar();
  }

  toggleFieldPropertiesSidebar(field: FormField, isGeneral: boolean): void {
    this.isFieldPropertiesOpen = !this.isFieldPropertiesOpen;
    this.isFieldsInsertingOpen = false;
    this.toggleSidebar();
    this.fieldToEdit = field;
    this.isGeneral = isGeneral;
  }

  onPropertiesSave(selectedField: FormField): void {
    if (selectedField) {
      const newFormControl = this.uiFormService.createControl(selectedField.defaultValue);

      if (this.isGeneral) {
        this.generalFields.push(selectedField);
        this.generalForm.addControl(selectedField.id, newFormControl);
      } else {
        this.addedFields.push(selectedField);
        this.dynamicForm.addControl(selectedField.id, newFormControl);
      }

      if (this.isFieldUnique(selectedField.type as FormFieldType)) {
        this.usedFieldTypes.push(selectedField.type as FormFieldType);
      }

      this.saveCurrentStepData();
    }
  }

  onPropertiesSaveAfterEdit(updatedField: FormField): void {
    if (updatedField) {
      let fieldsArray: FormField[];

      if (this.isGeneral) {
        fieldsArray = this.generalFields;
      } else {
        fieldsArray = this.addedFields;
      }

      const index = fieldsArray.indexOf(this.fieldToEdit);
      if (index !== -1) {
        if (updatedField.step !== this.currentStep) {
          fieldsArray.splice(index, 1);
          const newStepIndex = updatedField.step as number;
          const targetStep = this.formData.formData.steps[newStepIndex];
          targetStep.addedFields.push(updatedField);
        } else {
          fieldsArray[index] = updatedField;
        }
      }

      if (updatedField.defaultValue !== undefined) {
        const formControl = this.dynamicForm.get(updatedField.id);
        if (formControl) {
          formControl.setValue(updatedField.defaultValue);
        }
      }

      this.saveCurrentStepData();
    }
  }
}
