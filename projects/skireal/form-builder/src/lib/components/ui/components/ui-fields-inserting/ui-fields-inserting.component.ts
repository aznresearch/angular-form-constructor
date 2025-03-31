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

    if (this.isFormCreated && this.selectedFieldType !== fieldType) {
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
    const fieldProperties = this.uiFormService.saveFieldProperties(
      this.propertyForm,
      this.selectedFieldType
    );
    this.propertiesSaved.emit(fieldProperties);
    this.sidebarClosed.emit();
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }
}
