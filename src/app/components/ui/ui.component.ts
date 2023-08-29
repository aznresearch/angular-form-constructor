import { Component, OnInit, Type } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';
import { SharedModalConfirmationComponent } from '../shared/shared-modal-confirmation/shared-modal-confirmation.component';

interface FormField {
  name: string;
  id: string;
  label: string;
  type: string;
  options?: { value: any; label: string }[];
}

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

  currentStep = 0;

  modalOptions = {
    initialState: {
      message: 'Are you sure you want to clear the form?'
    },
    class: 'modal-md'
  };

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
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
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.addedFields = this.formData[this.currentStep] ? [...this.formData[this.currentStep]] : [];
    this.createForm();
  }

  saveCurrentStepData() {
    this.formData[this.currentStep] = [...this.addedFields];
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

    modalRef.content.close.subscribe((result: boolean) => {
      if (result) {
        this.clearCurrentStep();
      }
    });
  }

  clearCurrentStep() {
    this.addedFields = [];
    this.formData[this.currentStep] = [];
    Object.keys(this.dynamicForm.controls).forEach((controlName) => {
      if (this.dynamicForm.contains(controlName)) {
        this.dynamicForm.removeControl(controlName);
      }
    });
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.addedFields, event.previousIndex, event.currentIndex);
  }
}
