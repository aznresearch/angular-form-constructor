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
} from 'src/app/constants/ui-constants';
import { FormField } from 'src/app/models/form-constructor.model';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { LocaleService } from 'src/app/services/locale.service';
import { UiFormService } from 'src/app/services/ui-form.service';

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

  constructor(
    private fb: FormBuilder,
    private uiFormService: UiFormService,
    private confirmationService: ConfirmationService,
    private localeService: LocaleService
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

  selectField(fieldType: string) {
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

  resetFormAndSelectField(fieldType: string) {
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
    if (this.selectedFieldType === 'need-contact') {
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
      this.showMissingFieldsError(missingFields);
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

  showMissingFieldsError(missingFields: string[]): void {
    const localizedMessage =
      this.localeService.getCurrentLocale()['Please fill in all required fields'] ||
      'Please fill in all required fields';

    alert(`${localizedMessage}: ${missingFields.join(', ')}`);
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }
}
