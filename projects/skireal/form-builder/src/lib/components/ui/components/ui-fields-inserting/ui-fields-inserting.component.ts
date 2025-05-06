import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  fieldsByType,
  formFieldTypes,
  defaultOptionValues,
  FieldTypesNames,
  fieldTypesNames,
  haveOptionsFieldTypes,
  FormFieldType,
  surveyFieldTypes
} from '../../../../constants/ui-constants';
import { FormField } from '../../../../models/form-constructor.model';
import { UiFormService } from '../../../../services/ui-form.service';
import { ConfirmationService } from '../../../../services/confirmation.service';
import { LocaleService } from '../../../../services/locale.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-ui-fields-inserting',
  templateUrl: './ui-fields-inserting.component.html',
  styleUrls: ['./ui-fields-inserting.component.scss']
})
export class UIFieldsInsertingComponent implements OnInit {
  @Output() propertiesSaved: EventEmitter<FormField> = new EventEmitter<FormField>();
  @Output() sidebarClosed: EventEmitter<void> = new EventEmitter<void>();
  @Input() isGeneral = false;
  @Input() enableSetValidationOptions = false;
  @Input() isSurvey = true;
  @Input() usedFieldTypes: FormFieldType[] = [];
  @Input() needContactDefaultValue: string | undefined;

  selectedFieldType!: FormFieldType;
  propertyForm: FormGroup = this.fb.group({});
  availableFieldTypes = formFieldTypes;
  fieldLabels: FieldTypesNames = fieldTypesNames;
  isFormCreated = false;
  fieldsToCreate: FormField[] = [];
  selectedFiledType = '';
  @Input() hasFeedBackText = false;

  constructor(
    private fb: FormBuilder,
    private uiFormService: UiFormService,
    private confirmationService: ConfirmationService,
    private localeService: LocaleService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.setAvailableFieldTypes();
  }

  setAvailableFieldTypes() {
    let allFieldTypes: FormFieldType[];

    if (this.isGeneral) {
      allFieldTypes = [FormFieldType.Text, FormFieldType.Checkbox, FormFieldType.Select];
    } else if (this.isSurvey) {
      allFieldTypes = surveyFieldTypes;
    } else {
      allFieldTypes = formFieldTypes;
    }

    this.availableFieldTypes = allFieldTypes.filter(
      (fieldType) => !this.usedFieldTypes.includes(fieldType)
    );
  }

  selectField(fieldType: FormFieldType) {
    if (fieldType === this.selectedFieldType) {
      return;
    }
    this.selectedFiledType = fieldType;

    if (
      this.isFormCreated &&
      this.selectedFieldType !== fieldType &&
      this.hasFilledRequiredFields()
    ) {
      const localizedMessage =
        this.localeService.getCurrentLocale()[
          'Are you sure you want to complete field creation without saving?'
        ] || 'Are you sure you want to complete field creation without saving?';
      this.confirmationService.open(localizedMessage).then((result) => {
        if (result) {
          this.resetFormAndSelectField(fieldType);
        }
      });
    } else {
      this.resetFormAndSelectField(fieldType);
    }
  }

  resetFormAndSelectField(fieldType: FormFieldType) {
    const foundFieldType = this.availableFieldTypes.find((field) => field === fieldType);
    if (foundFieldType) {
      this.selectedFieldType = foundFieldType;
    }
    this.uiFormService.setFieldsToCreate(fieldType);
    this.createPropertyForm();
    if (haveOptionsFieldTypes.includes(this.selectedFieldType)) {
      this.setDefaultOptionValues();
    }
  }

  hasFilledRequiredFields(): boolean {
    const requiredFields = this.getRequiredFields(this.selectedFieldType);
    const missingFields = this.getMissingFields(requiredFields);

    return missingFields.length === 0;
  }

  setDefaultOptionValues() {
    let optionValues = defaultOptionValues;
    const formArray = this.propertyForm?.get('options') as FormArray;
    if (this.selectedFieldType === FormFieldType.NeedContact) {
      optionValues = [
        { name: 'Yes', value: '1' },
        { name: 'No', value: '0' }
      ];
    }
    optionValues.forEach((option) => {
      const group = this.fb.group({
        name: this.fb.control(option.name),
        value: this.fb.control(option.value)
      });
      formArray.push(group);
    });
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createFormGroup(fieldsByType[this.selectedFieldType]);
    this.isFormCreated = true;
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.propertyForm.get('active')?.setValue(true);
  }

  saveFieldProperties() {
    const requiredFields = this.getRequiredFields(this.selectedFieldType);
    const missingFields = this.getMissingFields(requiredFields);

    if (missingFields.length > 0) {
      this.validationService.showMissingFieldsError(missingFields, this.selectedFieldType);
      return;
    }

    const fieldProperties = this.uiFormService.saveFieldProperties(
      this.propertyForm,
      this.selectedFieldType
    );
    this.propertiesSaved.emit(fieldProperties);
    this.sidebarClosed.emit();
  }

  getRequiredFields(fieldType: string): string[] {
    const baseFields = ['title', 'analyticsTitle'];
    const typeSpecificFields: Record<string, string[]> = {
      select: ['options'],
      'checkbox-group': ['options'],
      radio: ['options'],
      likert: ['options', 'rows'],
      qe: ['qeScales']
    };

    return [...baseFields, ...(typeSpecificFields[fieldType] || [])];
  }

  getMissingFields(requiredFields: string[]): string[] {
    return requiredFields.filter((field) => {
      if (['options', 'rows', 'qeScales'].includes(field)) {
        return this.isFieldArrayInvalid(field);
      }

      return !this.propertyForm.get(field)?.value?.trim();
    });
  }

  isFieldArrayInvalid(field: string): boolean {
    const fieldArray = this.propertyForm.get(field) as FormArray;
    if (!fieldArray || fieldArray.length === 0) {
      return true;
    }

    return fieldArray.controls.some((control) => {
      const title = control.get('title')?.value?.trim();
      const name = control.get('name')?.value?.trim();
      const value = control.get('value')?.value?.trim();

      const fieldChecks: Record<string, boolean> = {
        rows: !title,
        options: !name || !value,
        qeScales: !title
      };

      return fieldChecks[field] ?? false;
    });
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }
}
