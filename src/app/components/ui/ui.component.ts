import { Component, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';
import { SharedModalConfirmationComponent } from '../shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  ConditionalLogicBlock,
  FormDataStructure,
  FormField
} from 'src/app/models/form-constructor.model';
import {
  FieldTypesNames,
  defaultConditionalLogicBlock,
  fieldTypesNames
} from 'src/app/constants/ui-constants';
import { UiFormService } from 'src/app/services/ui-form.service';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  modalRef: BsModalRef | undefined;

  dynamicForm!: FormGroup;
  generalForm!: FormGroup;
  formData: FormDataStructure = {
    steps: [],
    generalFields: []
  };
  addedFields: FormField[] = [];
  generalFields: FormField[] = [];
  conditionalLogicBlocks: ConditionalLogicBlock[] = [];
  fieldLabels: FieldTypesNames = fieldTypesNames;

  currentStep = 0;

  modalOptions = {
    initialState: {
      message: 'Are you sure you want to clear the form?'
    },
    class: 'modal-md'
  };

  constructor(
    private modalService: BsModalService,
    private localStorageService: LocalStorageService,
    private uiFormService: UiFormService,
    private router: Router,
    private formDataService: FormDataService
  ) {}

  ngOnInit(): void {
    this.restoreFormDataFromLocalStorage();
    this.createForm();
  }

  createForm() {
    this.dynamicForm = this.uiFormService.createFormGroup(this.addedFields);
    this.generalForm = this.uiFormService.createFormGroup(this.generalFields);
  }

  openFieldsInsertingModal(isGeneral: boolean) {
    const initialState = {
      isGeneral
    };
    this.openModal(UIModalFieldsInsertingComponent, initialState);
    this.modalRef?.content.propertiesSave.subscribe((selectedField: FormField) => {
      if (selectedField) {
        if (isGeneral) {
          this.generalFields.push(selectedField);
        } else {
          this.addedFields.push(selectedField);
        }
        const newFormControl = this.uiFormService.createControl();
        this.dynamicForm.addControl(selectedField.id, newFormControl);
        this.saveCurrentStepData();
      }
    });
  }

  openFieldPropertiesModal(field: FormField) {
    const initialState = {
      field
    };

    this.openModal(UIModalFieldPropertiesComponent, initialState);

    this.modalRef?.content.propertiesSave.subscribe((updatedField: FormField) => {
      if (updatedField) {
        const index = this.addedFields.indexOf(field);
        if (index !== -1) {
          this.addedFields[index] = updatedField;
        }
        this.saveCurrentStepData();
      }
    });
  }

  removeField(field: FormField) {
    const index = this.addedFields.indexOf(field);
    if (index !== -1) {
      this.addedFields.splice(index, 1);
      this.dynamicForm.removeControl(field.id);
    }
    this.saveCurrentStepData();
  }

  copyField(field: FormField) {
    const copiedField = { ...field };
    copiedField.id = this.uiFormService.generateUniqueId();
    const originalFieldIndex = this.addedFields.indexOf(field);
    this.addedFields.splice(originalFieldIndex + 1, 0, copiedField);
    const newFormControl = this.uiFormService.createControl();
    this.dynamicForm.addControl(copiedField.id, newFormControl);
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

    this.addedFields = this.formData.steps[this.currentStep]?.addedFields
      ? this.formData.steps[this.currentStep].addedFields
      : [];
    this.conditionalLogicBlocks = this.formData.steps[this.currentStep]?.conditionalLogicBlocks
      ? this.formData.steps[this.currentStep].conditionalLogicBlocks
      : [];
    this.createForm();
  }

  saveCurrentStepData() {
    this.formData.generalFields = [...this.generalFields];
    this.formData.steps[this.currentStep] = {
      addedFields: [...this.addedFields],
      conditionalLogicBlocks: [...this.conditionalLogicBlocks]
    };
    this.saveFormDataToLocalStorage();
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

  clearFormConfirmation() {
    const modalRef = this.modalService.show(SharedModalConfirmationComponent, this.modalOptions);

    modalRef.content.confirm.subscribe((result: boolean) => {
      if (result) {
        this.clearCurrentStep();
      }
    });
  }

  clearCurrentStep() {
    this.addedFields = [];
    this.conditionalLogicBlocks = [];
    this.formData.steps.splice(this.currentStep, 1);

    Object.keys(this.dynamicForm.controls).forEach((controlName) => {
      if (this.dynamicForm.contains(controlName)) {
        this.dynamicForm.removeControl(controlName);
      }
    });

    if (this.formData.steps.length > 0 && this.currentStep >= this.formData.steps.length) {
      this.goToStep(this.currentStep - 1);
    }

    this.saveFormDataToLocalStorage();
  }

  restoreFormDataFromLocalStorage() {
    const savedFormData = this.localStorageService.getItem('formData');

    if (savedFormData) {
      this.formData = savedFormData;
    } else {
      this.formData = {
        steps: [],
        generalFields: []
      };
    }

    this.addedFields = this.formData.steps[this.currentStep].addedFields ?? [];
    this.generalFields = this.formData.generalFields ?? [];
    this.conditionalLogicBlocks =
      this.formData.steps[this.currentStep].conditionalLogicBlocks ?? [];
  }

  saveFormDataToLocalStorage() {
    this.localStorageService.setItem('formData', this.formData);
  }

  finishForm() {
    this.saveCurrentStepData();
    const payload = this.formDataService.prepareFormData(this.formData);
    this.formDataService.setFormData(payload);
    this.router.navigate(['/finish']);
  }

  openModal(component: Type<any>, initialState?: any) {
    this.modalRef = this.modalService.show(component, {
      initialState,
      class: 'modal-dialog-centered'
    });
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.addedFields, event.previousIndex, event.currentIndex);
    this.saveCurrentStepData();
  }
}
