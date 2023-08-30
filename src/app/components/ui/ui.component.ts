import { Component, OnInit, Type } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';
import { SharedModalConfirmationComponent } from '../shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FormField } from 'src/app/models/form-constructor.model';
import { fieldTypesNames } from 'src/app/constants/ui-constants';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  modalRef: BsModalRef | undefined;

  dynamicForm!: FormGroup;
  formData: FormField[][] = [];
  addedFields: FormField[] = [];
  fieldLabels = fieldTypesNames;

  currentStep = 0;

  modalOptions = {
    initialState: {
      message: 'Are you sure you want to clear the form?'
    },
    class: 'modal-md'
  };

  constructor(
    private modalService: BsModalService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.restoreFormDataFromLocalStorage();
    this.createForm();
  }

  createForm() {
    this.dynamicForm = new FormGroup({});
    this.addedFields.forEach((field) => {
      this.addControlToForm(field);
    });
  }

  addControlToForm(field: FormField) {
    const control = new FormControl('');
    this.dynamicForm.addControl(field.id, control);
  }

  openFieldsInsertingModal() {
    this.openModal(UIModalFieldsInsertingComponent);
    this.modalRef?.content.propertiesSave.subscribe((selectedField: FormField) => {
      if (selectedField) {
        this.addedFields.push(selectedField);
        this.addControlToForm(selectedField);
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

  openModal(component: Type<any>, initialState?: any) {
    this.modalRef = this.modalService.show(component, {
      initialState,
      class: 'modal-dialog-centered'
    });
  }

  removeField(field: FormField) {
    const index = this.addedFields.indexOf(field);
    if (index !== -1) {
      this.addedFields.splice(index, 1);
      this.dynamicForm.removeControl(field.name);
    }
    this.saveCurrentStepData();
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.addedFields = this.formData[this.currentStep] ? [...this.formData[this.currentStep]] : [];
    this.createForm();
  }

  saveCurrentStepData() {
    this.formData[this.currentStep] = [...this.addedFields];
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
    this.formData.splice(this.currentStep, 1);

    Object.keys(this.dynamicForm.controls).forEach((controlName) => {
      if (this.dynamicForm.contains(controlName)) {
        this.dynamicForm.removeControl(controlName);
      }
    });

    if (this.formData.length > 0 && this.currentStep >= this.formData.length) {
      this.goToStep(this.currentStep - 1);
    }

    this.saveFormDataToLocalStorage();
  }

  restoreFormDataFromLocalStorage() {
    const savedFormData = this.localStorageService.getItem('formData');

    if (savedFormData) {
      this.formData = savedFormData;
    } else {
      this.formData = [];
    }

    this.addedFields = this.formData[this.currentStep] ?? [];
  }

  saveFormDataToLocalStorage() {
    this.localStorageService.setItem('formData', this.formData);
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.addedFields, event.previousIndex, event.currentIndex);
    this.saveCurrentStepData();
  }
}
