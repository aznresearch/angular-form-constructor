import { Component, OnInit, Renderer2, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';
import { SharedModalConfirmationComponent } from '../shared/shared-modal-confirmation/shared-modal-confirmation.component';
import {
  ConditionalLogicBlock,
  FormField,
  FormOptionsFull
} from 'src/app/models/form-constructor.model';
import {
  FieldTypesNames,
  FormFieldType,
  defaultConditionalLogicBlock,
  fieldTypesNames,
  uniqueFieldTypes
} from 'src/app/constants/ui-constants';
import { UiFormService } from 'src/app/services/ui-form.service';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  private observer?: MutationObserver;

  modalRef: BsModalRef | undefined;

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

  enableSetValidationOptions = true;
  isSurvey = true;

  modalOptions = {
    initialState: {
      message: 'Are you sure you want to delete the step?'
    },
    class: 'modal-dialog-form-builder modal-dialog-form-builder--sm'
  };

  selectedFormData: string | null = null;
  formVisible: boolean = true;
  usedFieldTypes: FormFieldType[] = [];

  constructor(
    private modalService: BsModalService,
    private uiFormService: UiFormService,
    private formDataService: FormDataService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.restoreFormDataFromLocalStorage();
    this.createForm();
  }

  ngAfterViewInit() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            const element = node as HTMLElement;
            if (element.classList && element.classList.contains('modal')) {
              this.renderer.addClass(element, 'modal-form-builder');
              element.addEventListener('hidden.bs.modal', () => {
                this.renderer.removeClass(element, 'modal-form-builder');
              });
            }
          });
        }
      });
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  createForm() {
    this.dynamicForm = this.uiFormService.createFormGroup(this.addedFields);
    this.generalForm = this.uiFormService.createFormGroup(this.generalFields);
  }

  openFieldsInsertingModal(isGeneral: boolean) {
    const initialState = {
      isGeneral,
      enableSetValidationOptions: this.enableSetValidationOptions,
      isSurvey: this.isSurvey,
      usedFieldTypes: this.usedFieldTypes
    };
    this.openModal(UIModalFieldsInsertingComponent, initialState);
    this.modalRef?.content.propertiesSave.subscribe((selectedField: FormField) => {
      if (selectedField) {
        const newFormControl = this.uiFormService.createControl(selectedField.defaultValue);

        if (isGeneral) {
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
    });
  }

  openFieldPropertiesModal(field: FormField, isGeneral: boolean) {
    const stepsLength = this.formData.formData.steps.length;

    const initialState = {
      field,
      enableSetValidationOptions: this.enableSetValidationOptions,
      isSurvey: this.isSurvey,
      currentStep: this.currentStep,
      stepsLength: stepsLength
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

  restoreFormDataFromLocalStorage() {
    if (this.selectedFormData) {
      this.formData = JSON.parse(this.selectedFormData);
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
    console.dir(payload);
  }

  openModal(component: Type<any>, initialState?: any) {
    this.modalRef = this.modalService.show(component, {
      initialState,
      class: 'modal-dialog-form-builder'
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
    const modalRef = this.modalService.show(SharedModalConfirmationComponent, this.modalOptions);

    modalRef.content.confirm.subscribe((result: boolean) => {
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

  onFormDataChange(newFormData: string) {
    this.formVisible = false;
    setTimeout(() => {
      this.selectedFormData = newFormData;
      this.formVisible = true;
      this.restoreFormDataFromLocalStorage();
    }, 0);
  }

  isFieldUnique(fieldType: FormFieldType): boolean {
    return uniqueFieldTypes.includes(fieldType);
  }
}
