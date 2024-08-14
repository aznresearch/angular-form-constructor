import { Component, EventEmitter, Input, OnInit, Output, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';
import { SharedModalConfirmationComponent } from '../shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { LocalStorageService } from '../../services/local-storage.service';
import {
  ConditionalLogicBlock,
  FormDataStructure,
  FormField,
  FormOptionsFull
} from '../../models/form-constructor.model';
import {
  FieldTypesNames,
  defaultConditionalLogicBlock,
  fieldTypesNames
} from '../../constants/ui-constants';
import { UiFormService } from '../../services/ui-form.service';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  @Input() enableGeneralFields = true;
  @Input() enableConditionalLogicBlocks = false;
  @Input() isSurvey = true;

  @Output() finishClicked: EventEmitter<FormOptionsFull> = new EventEmitter<FormOptionsFull>();

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
      message: 'Are you sure you want to delete the step?'
    },
    class: 'modal-md'
  };

  constructor(
    private modalService: BsModalService,
    private localStorageService: LocalStorageService,
    private uiFormService: UiFormService,
    private formDataService: FormDataService
  ) {}

  ngOnInit(): void {
    this.restoreFormDataFromLocalStorage();
    this.createForm();
  }

  createForm() {
    this.dynamicForm = this.uiFormService.createFormGroup(this.addedFields);
    if (this.enableGeneralFields) {
      this.generalForm = this.uiFormService.createFormGroup(this.generalFields);
    }
  }

  openFieldsInsertingModal(isGeneral: boolean, isSurvey: boolean) {
    const initialState = {
      isGeneral,
      isSurvey
    };
    this.openModal(UIModalFieldsInsertingComponent, initialState);
    this.modalRef?.content.propertiesSave.subscribe((selectedField: FormField) => {
      if (selectedField) {
        const newFormControl = this.uiFormService.createControl();

        if (isGeneral) {
          this.generalFields.push(selectedField);
          this.generalForm.addControl(selectedField.id, newFormControl);
        } else {
          this.addedFields.push(selectedField);
          this.dynamicForm.addControl(selectedField.id, newFormControl);
        }
        this.saveCurrentStepData();
      }
    });
  }

  openFieldPropertiesModal(field: FormField, isGeneral: boolean) {
    const initialState = {
      field
    };

    this.openModal(UIModalFieldPropertiesComponent, initialState);

    this.modalRef?.content.propertiesSave.subscribe((updatedField: FormField) => {
      if (updatedField) {
        let fieldsArray: FormField[];

        if (isGeneral) {
          fieldsArray = this.generalFields;
        } else {
          fieldsArray = this.addedFields;
        }
        const index = fieldsArray.indexOf(field);
        if (index !== -1) {
          fieldsArray[index] = updatedField;
        }
        this.saveCurrentStepData();
      }
    });
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

    if (!this.formData.steps[this.currentStep]) {
      this.formData.steps[this.currentStep] = {
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
    this.formData.generalFields = [...this.generalFields];
    this.formData.steps[this.currentStep] = {
      addedFields: [...this.addedFields],
      conditionalLogicBlocks: [...this.conditionalLogicBlocks]
    };
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

    this.addedFields = this.formData.steps[this.currentStep]?.addedFields ?? [];
    this.generalFields = this.formData.generalFields ?? [];
    this.conditionalLogicBlocks =
      this.formData.steps[this.currentStep]?.conditionalLogicBlocks ?? [];
  }

  saveFormDataToLocalStorage() {
    this.localStorageService.setItem('formData', this.formData);
  }

  finishForm() {
    this.saveCurrentStepData();
    const payload = this.formDataService.prepareFormData(this.formData);
    this.formDataService.setFormData(payload);
    this.finishClicked.emit(payload);
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
    const formArray = event.container.data;
    moveItemInArray(formArray, event.previousIndex, event.currentIndex);
    this.saveCurrentStepData();
  }

  copyStep(index: number) {
    const copiedStep = { ...this.formData.steps[index] };
    copiedStep.addedFields = copiedStep.addedFields.map((field) => ({
      ...field,
      id: this.uiFormService.generateUniqueId()
    }));

    this.formData.steps.splice(index + 1, 0, copiedStep);
    this.goToStep(index + 1);
    this.saveCurrentStepData();
  }

  moveStep(index: number, direction: 'next' | 'prev') {
    if (direction === 'next') {
      [this.formData.steps[index], this.formData.steps[index + 1]] = [
        this.formData.steps[index + 1],
        this.formData.steps[index]
      ];
    } else if (direction === 'prev') {
      [this.formData.steps[index], this.formData.steps[index - 1]] = [
        this.formData.steps[index - 1],
        this.formData.steps[index]
      ];
    }

    this.goToStep(index);
    this.saveCurrentStepData();
  }

  deleteStepConfirmation(index: number) {
    const modalRef = this.modalService.show(SharedModalConfirmationComponent, this.modalOptions);

    modalRef.content.confirm.subscribe((result: boolean) => {
      if (result) {
        this.deleteStep(index);
      }
    });
  }

  deleteStep(index: number) {
    this.formData.steps.splice(index, 1);
    if (this.currentStep > index) {
      this.currentStep--;
    }
    this.updateStep();
    this.saveCurrentStepData();
  }

  updateStep() {
    this.addedFields = this.formData.steps[this.currentStep].addedFields;
    this.conditionalLogicBlocks = this.formData.steps[this.currentStep].conditionalLogicBlocks;
    this.createForm();
  }
}
