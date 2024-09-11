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
  defaultConditionalLogicBlock,
  fieldTypesNames
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

  incomingFormData =
    '{"formData":{"steps":[{"title":"Step 1","addedFields":[{"name":"AgeGroup","classes":"","placeholder":"Click to select","title":"111111111111111Which age group describes you?","subtitle":"","validators":[],"options":[{"name":"18-24","value":"18-24"},{"name":"25-30","value":"25-30"},{"name":"31-35","value":"31-35"},{"name":"36-40","value":"36-40"},{"name":"41-50","value":"41-50"},{"name":"51-60","value":"51-60"},{"name":"61+","value":"61+"}],"type":"select","id":"79395297"},{"name":"EmploymentCategory","classes":"","placeholder":"Click to select","title":"What is your current employment category?","subtitle":"","validators":[],"options":[{"name":"Civil/Public Servant","value":"Civil/Public Servant"},{"name":"Private Sector Employee","value":"Private Sector Employee"},{"name":"Self-Employed","value":"Self-Employed"},{"name":"Artisan/Technician","value":"Artisan/Technician"},{"name":"Undergraduate Student","value":"Undergraduate Student"},{"name":"Postgraduate Student","value":"Postgraduate Student"},{"name":"Retired","value":"Retired"},{"name":"Unemployed","value":"Unemployed"},{"name":"Other","value":"Other"}],"type":"select","id":"18310764"}],"conditionalLogicBlocks":[]},{"title":"Step 2","addedFields":[{"name":"informations","classes":"","placeholder":"","title":"Where did you find information on Ecobank account opening?","subtitle":"Select all that apply","validators":[],"options":[{"name":"Ecobank branch","value":"1"},{"name":"Ecobank Website (live chat)","value":"2"},{"name":"Social Media","value":"3"},{"name":"TV/radio","value":"4"},{"name":"Internet blogs/websites","value":"5"},{"name":"Family/Friends/Colleagues","value":"6"},{"name":"Other","value":"0"}],"type":"checkbox-group","id":"76490954"}],"conditionalLogicBlocks":[]}],"generalFields":[]}}';

  incomingFormData2 =
    '{"formData":{"steps":[{"title":"Step 1","addedFields":[{"name":"AgeGroup","classes":"","placeholder":"Click to select","title":"Which age group describes you?","subtitle":"","validators":[],"options":[{"name":"18-24","value":"18-24"},{"name":"25-30","value":"25-30"},{"name":"31-35","value":"31-35"},{"name":"36-40","value":"36-40"},{"name":"41-50","value":"41-50"},{"name":"51-60","value":"51-60"},{"name":"61+","value":"61+"}],"type":"select","id":"79395297"},{"name":"EmploymentCategory","classes":"","placeholder":"Click to select","title":"What is your current employment category?","subtitle":"","validators":[],"options":[{"name":"Civil/Public Servant","value":"Civil/Public Servant"},{"name":"Private Sector Employee","value":"Private Sector Employee"},{"name":"Self-Employed","value":"Self-Employed"},{"name":"Artisan/Technician","value":"Artisan/Technician"},{"name":"Undergraduate Student","value":"Undergraduate Student"},{"name":"Postgraduate Student","value":"Postgraduate Student"},{"name":"Retired","value":"Retired"},{"name":"Unemployed","value":"Unemployed"},{"name":"Other","value":"Other"}],"type":"select","id":"18310764"}],"conditionalLogicBlocks":[]},{"title":"Step 2","addedFields":[{"name":"informations","classes":"","placeholder":"","title":"Where did you find information on Ecobank account opening?","subtitle":"Select all that apply","validators":[],"options":[{"name":"Ecobank branch","value":"1"},{"name":"Ecobank Website (live chat)","value":"2"},{"name":"Social Media","value":"3"},{"name":"TV/radio","value":"4"},{"name":"Internet blogs/websites","value":"5"},{"name":"Family/Friends/Colleagues","value":"6"},{"name":"Other","value":"0"}],"type":"checkbox-group","id":"76490954"}],"conditionalLogicBlocks":[]},{"title":"Step 3","addedFields":[{"name":"HowApply","classes":"","placeholder":"Click to select","title":"How did you open your account?","subtitle":"","validators":[],"options":[{"name":"Branch","value":"br"},{"name":"Ecobank Website (live chat)","value":"ew"},{"name":"Relationship Manager","value":"rm"},{"name":"Mobile App (live chat)","value":"ma"},{"name":"Social Media","value":"rc"},{"name":"Xpress Agent","value":"xa"},{"name":"Contact Centre","value":"cc"},{"name":"USSD","value":"us"}],"type":"select","id":"9676052"},{"name":"HowLongReceived","classes":"","placeholder":"Click to select","title":"How long did it take before your account was opened?","subtitle":"","validators":[],"options":[{"name":"Immediately","value":"Immediately"},{"name":"Within a few minutes","value":"Within a few minutes"},{"name":"Within a few hours","value":"Within a few hours"},{"name":"The next day","value":"The next day"},{"name":"A few days later","value":"A few days later"},{"name":"A week later","value":"A week later"},{"name":"A month later","value":"A month later"},{"name":"Over a month later","value":"Over a month later"},{"name":"My account is not open","value":"My account is not open"}],"type":"select","id":"32393603"},{"name":"AfterReceiving","classes":"","placeholder":"Click to select","title":"How soon were you able to transact after opening your account?","subtitle":"","validators":[],"options":[{"name":"Immediately","value":"Immediately"},{"name":"Within a few minutes","value":"Within a few minutes"},{"name":"Within a few hours","value":"Within a few hours"},{"name":"The next day","value":"The next day"},{"name":"A few days later","value":"A few days later"},{"name":"A week later","value":"A week later"},{"name":"A month later","value":"A month later"},{"name":"Over a month later","value":"Over a month later"},{"name":"I am unable to transact","value":"I am unable to transact"}],"type":"select","id":"30623352"}],"conditionalLogicBlocks":[]},{"title":"Step 4","addedFields":[{"name":"QEGroup","classes":"","placeholder":"","title":"On a scale of 1-10, 1 being the lowest and 10 being the highest, how satisfied are you with the following aspects of our Customer Experience?","subtitle":"","validators":[],"firstAnswer":"Very dissatisfied","lastAnswer":"Very satisfied","qeScales":[{"title":"Clear and easy-to-understand instructions, steps and requirements","subtitle":"","qeScaleChildren":[]},{"title":"Available account types that match your specific needs and objectives","subtitle":"","qeScaleChildren":[]},{"title":"Amount of information and documents required to open an account (.e.g. proof of identity documents)","subtitle":"","qeScaleChildren":[]},{"title":"Time taken to complete the application","subtitle":"","qeScaleChildren":[]},{"title":"Time taken for your account to be activated for transactions","subtitle":"","qeScaleChildren":[]},{"title":"Timely and accurate information provided by the Bank (.e.g. document requirements, account number, digital log-in details)","subtitle":"","qeScaleChildren":[]},{"title":"Transparent terms and conditions","subtitle":"","qeScaleChildren":[]},{"title":"Ease of registration on digital platforms (.e.g. mobile banking) as part of the account opening process","subtitle":"","qeScaleChildren":[]},{"title":"Quality of service, professionalism and friendliness you received from Ecobank staff","subtitle":"","qeScaleChildren":[]},{"title":"Effective and timely resolution of any complaints or issues you encountered","subtitle":"","qeScaleChildren":[]}],"type":"qe","id":"62162107"}],"conditionalLogicBlocks":[]},{"title":"Step 5","addedFields":[{"name":"NPS","classes":"","placeholder":"","title":"Based on your experience in opening your account, how likely are you to recommend Ecobank to others? (On a scale of 1-10)","subtitle":"","validators":[],"commentTitle":"What is the primary reason for your score?","commentSubtitle":"Type your message here","firstAnswer":"Very unlikely","lastAnswer":"Very likely","type":"nps","id":"57422533"}],"conditionalLogicBlocks":[]},{"title":"Step 6","addedFields":[{"name":"NeedContact","classes":"","placeholder":"","title":"Do you have any unresolved issue that you would like to be contacted on?","subtitle":"","validators":[],"options":[{"name":"Yes","value":"true"},{"name":"No","value":"false"}],"type":"radio-boolean","id":"72424646"},{"name":"Name","classes":"","placeholder":"","title":"First Name","subtitle":"","validators":[],"type":"text","id":"26528148"},{"name":"Surname","classes":"","placeholder":"","title":"Last Name","subtitle":"","validators":[],"type":"text","id":"41908719"},{"name":"Email","classes":"","placeholder":"","title":"Email","subtitle":"","validators":[],"type":"email","id":"61485254"},{"name":"Phone","classes":"","placeholder":"","title":"Phone (optional)","subtitle":"","validators":[],"type":"number","id":"12726424"}],"conditionalLogicBlocks":[]}],"generalFields":[]}}';

  selectedFormData: string = this.incomingFormData;

  formVisible: boolean = true;

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
      isSurvey: this.isSurvey
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
}
