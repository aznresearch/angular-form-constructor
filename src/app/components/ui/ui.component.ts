import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { LocaleService } from 'src/app/services/locale.service';
import { locale } from 'src/app/constants/en';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  formFieldType = FormFieldType;
  dynamicForm!: FormGroup;
  generalForm!: FormGroup;
  formData: FormOptionsFull = {
    formData: {
      steps: [
        {
          title: 'Step 1',
          addedFields: [
            {
              active: true,
              classes: '',
              placeholder: '',
              title: 'wrwerreewr',
              description: '',
              validators: [],
              required: false,
              warningMessage: '',
              analyticsTitle: 'rwerwe',
              step: 0,
              options: [
                {
                  name: 'Yes',
                  value: '1',
                  id: '94452308'
                },
                {
                  name: 'No',
                  value: '0',
                  id: '11747540'
                }
              ],
              defaultValue: '1',
              type: 'need-contact',
              id: '78362313',
              hasOther: false,
              hasNA: false
            },
            {
              active: true,
              classes: '',
              placeholder: '',
              title: 'fghf',
              description: '',
              validators: [],
              required: false,
              warningMessage: '',
              analyticsTitle: 'рапрарпр',
              type: 'text',
              id: '99067912',
              hasOther: false,
              hasNA: false
            },
            {
              active: true,
              classes: '',
              placeholder: '',
              title: 'select',
              description: '',
              validators: [],
              required: false,
              warningMessage: '',
              analyticsTitle: 'select fsfdf',
              options: [
                {
                  name: 'dasd',
                  value: 'adas',
                  country: 'ZZ',
                  id: '58813254'
                },
                {
                  name: 'dasdas',
                  value: 'dassdasdas',
                  country: 'ZZ',
                  id: '77744320'
                }
              ],
              hasOther: false,
              type: 'select',
              id: '10775895',
              hasNA: false
            },
            {
              active: true,
              classes: '',
              placeholder: '',
              title: 'fdsfsdffd',
              description: '',
              validators: [],
              required: false,
              warningMessage: '',
              analyticsTitle: 'fdsfsddsf',
              feedBackText: true,
              type: 'text',
              id: '47795807',
              hasOther: false,
              hasNA: false
            }
          ],
          conditionalLogicBlocks: []
        }
      ],
      generalFields: []
    },
    options: {
      name: 'string',
      type: 'string',
      country: 'string'
    }
  };
  addedFields: FormField[] = [];
  generalFields: FormField[] = [];
  conditionalLogicBlocks: ConditionalLogicBlock[] = [];
  fieldLabels: FieldTypesNames = fieldTypesNames;

  currentStep = 0;

  enableSetValidationOptions = false;
  isSurvey = true;

  selectedFormData: string | null = null;
  formVisible: boolean = true;
  usedFieldTypes: FormFieldType[] = [];

  isSidebarOpen = false;
  isFieldsInsertingOpen = false;
  isFieldPropertiesOpen = false;
  isGeneral = false;
  fieldToEdit: FormField = { id: '', name: '' };
  needContactDefaultValue: string | undefined;
  locale: Record<string, string> = locale;
  hasFeedBackText = false;
  editedFieldId: string | null = null;

  constructor(
    private uiFormService: UiFormService,
    private formDataService: FormDataService,
    private confirmationService: ConfirmationService,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.insertFormData();
    this.createForm();
    this.localeService.setLocale(this.locale);
    this.initializeUsedFieldTypes(this.addedFields);
    this.updateSpecialFieldStates();
  }

  insertFormData() {
    this.addedFields = this.formData.formData.steps[this.currentStep]?.addedFields ?? [];
    this.generalFields = this.formData.formData.generalFields ?? [];
    this.conditionalLogicBlocks =
      this.formData.formData.steps[this.currentStep]?.conditionalLogicBlocks ?? [];
  }

  createForm() {
    this.dynamicForm = this.uiFormService.createFormGroup(this.addedFields);
    this.generalForm = this.uiFormService.createFormGroup(this.generalFields);
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
    if (copiedField.feedBackText) {
      copiedField.feedBackText = false;
    }
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
    if (this.addedFields.length === 0) {
      return;
    }
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
    this.updateSpecialFieldStates();
  }

  updateSpecialFieldStates(): void {
    const needContactField = this.findFieldInSteps(FormFieldType.NeedContact);
    this.needContactDefaultValue = needContactField?.defaultValue;

    if (
      needContactField &&
      needContactField.defaultValue !== undefined &&
      !this.enableSetValidationOptions
    ) {
      this.updateRequiredFields(needContactField.defaultValue);
    }

    this.updateFeedBackTextFields();
  }

  updateFeedBackTextFields(): void {
    this.hasFeedBackText = false;

    for (const step of this.formData.formData.steps) {
      for (const field of step.addedFields) {
        if (
          field.type &&
          [FormFieldType.Text, FormFieldType.Textarea].includes(field.type as FormFieldType) &&
          field.feedBackText
        ) {
          this.hasFeedBackText = true;
          break;
        }
      }
      if (this.hasFeedBackText) break;
    }
  }

  findFieldInSteps(fieldType: string): FormField | undefined {
    for (const step of this.formData.formData.steps) {
      const field = step.addedFields.find((f) => f.type === fieldType);
      if (field) {
        return field;
      }
    }
    return undefined;
  }

  updateRequiredFields(value: string): void {
    const isRequired = value === '1';

    for (const step of this.formData.formData.steps) {
      step.addedFields.forEach((field) => {
        if (
          field.type &&
          [
            FormFieldType.ContactName,
            FormFieldType.ContactSurname,
            FormFieldType.ContactEmail
          ].includes(field.type as FormFieldType)
        ) {
          field.required = isRequired;
        }
      });
    }
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

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    const formArray = event.container.data;
    moveItemInArray(formArray, event.previousIndex, event.currentIndex);
    this.saveCurrentStepData();
  }

  copyStep(index: number) {
    if (this.addedFields.length === 0) {
      return;
    }
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
    const localizedMessage =
      this.localeService.getCurrentLocale()['Are you sure you want to delete this step?'] ||
      'Are you sure you want to delete this step?';
    this.confirmationService.open(localizedMessage).then((result) => {
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

  toggleSidebar(): void {
    this.isSidebarOpen = this.isFieldsInsertingOpen || this.isFieldPropertiesOpen;
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

    this.editedFieldId = this.isFieldPropertiesOpen ? field.id : null;

    if (!this.isSidebarOpen) {
      this.editedFieldId = null;
    }
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

      this.addUsedFieldType(selectedField.type as FormFieldType);

      this.saveCurrentStepData();
    }
  }

  addUsedFieldType(type: FormFieldType): void {
    if (this.isFieldUnique(type) && !this.usedFieldTypes.includes(type)) {
      this.usedFieldTypes.push(type);
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

  initializeUsedFieldTypes(fields: FormField[]): void {
    fields.forEach((field) => {
      this.addUsedFieldType(field.type as FormFieldType);
    });
  }
}
