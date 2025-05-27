import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  arrayProperties,
  fieldsByType,
  fieldTypesNames,
  FieldTypesNames,
  FormFieldType
} from 'src/app/constants/ui-constants';
import {
  FieldItem,
  FormField,
  Option,
  QeScale,
  QeScaleChild
} from 'src/app/models/form-constructor.model';
import { LocaleService } from 'src/app/services/locale.service';
import { UiFormService } from 'src/app/services/ui-form.service';
import { ValidationService } from 'src/app/services/validation.service';
@Component({
  selector: 'app-ui-field-properties',
  templateUrl: './ui-field-properties.component.html',
  styleUrls: ['./ui-field-properties.component.scss']
})
export class UIFieldPropertiesComponent implements OnInit {
  @Output() propertiesSaved: EventEmitter<FormField> = new EventEmitter<FormField>();
  @Output() sidebarClosed: EventEmitter<void> = new EventEmitter<void>();
  @Input() enableSetValidationOptions = false;
  @Input() isSurvey = true;
  @Input() currentStep = 0;
  @Input() stepsLength = 1;
  @Input() field: FormField = { id: '', name: '' };
  @Input() needContactDefaultValue: string | undefined;
  @Input() hasFeedBackText = false;

  propertyForm: FormGroup = this.fb.group({});
  selectedFieldType!: FormFieldType;
  fieldsToCreate: FormField[] = [];
  fieldLabels: FieldTypesNames = fieldTypesNames;

  constructor(
    private fb: FormBuilder,
    private uiFormService: UiFormService,
    private localeService: LocaleService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.selectedFieldType = Object.values(FormFieldType).includes(this.field.type as FormFieldType)
      ? (this.field.type as FormFieldType)
      : FormFieldType.Text;
    this.uiFormService.setFieldsToCreate(this.selectedFieldType);
    this.createPropertyForm();
    this.patchFieldProperties();
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createFormGroup(fieldsByType[this.selectedFieldType]);
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.propertyForm.get('active')?.setValue(true);
  }

  patchFieldProperties() {
    this.propertyForm.patchValue(this.field);

    arrayProperties.forEach((fieldName) => {
      const propertyArray = this.propertyForm.get(fieldName) as FormArray;
      const propertyData = this.field[fieldName] as FieldItem[];

      if (propertyArray && propertyData) {
        this.patchArrayData(propertyArray, propertyData);
      }
    });
  }

  patchArrayData(array: FormArray, data: FieldItem[] | undefined) {
    if (data) {
      data.forEach((item) => {
        const group = this.fb.group({});

        Object.keys(item).forEach((key) => {
          const itemKey = key as keyof FieldItem;

          if (Array.isArray(item[itemKey])) {
            const nestedArray = this.fb.array([]);
            this.patchArrayData(nestedArray, item[itemKey] as any[]);
            group.addControl(itemKey, nestedArray);
          } else {
            group.addControl(itemKey, this.fb.control(item[itemKey]));
          }
        });

        array.push(group);
      });
    }
  }

  saveFieldProperties() {
    const requiredFields = this.getRequiredFields(this.selectedFieldType);
    const missingFields = this.getMissingFields(requiredFields);

    const countryLengthIssues =
      this.propertyForm
        ?.get('options')
        ?.value?.filter((option: any) => option?.country && option.country.length === 1) ?? [];

    const errors: string[] = [];

    if (missingFields.length > 0) {
      const missing = this.validationService.getMissingFieldsMessage(
        missingFields,
        this.selectedFieldType
      );
      errors.push(missing);
    }

    if (countryLengthIssues.length > 0) {
      const countryError =
        this.localeService.getCurrentLocale()[
          'Option Country must be either 0 or 2 characters long'
        ] || 'Option Country must be either 0 or 2 characters long';
      errors.push(countryError);
    }

    if (errors.length > 0) {
      alert(errors.join('\n\n'));
      return;
    }

    const updatedFieldProperties: FormField = {
      ...this.field,
      ...this.propertyForm.value,
      options: this.propertyForm.value.options?.map((option: Option) => {
        if (!option.id) {
          return {
            ...option,
            id: this.uiFormService.generateUniqueId()
          };
        }
        return option;
      })
    };

    if (updatedFieldProperties.type === FormFieldType.NPS) {
      const isCommentEmpty = Object.values(updatedFieldProperties.comment || {}).every(
        (value) => value === '' || value === null || value === undefined
      );

      if (!isCommentEmpty) {
        updatedFieldProperties.comment = {
          ...updatedFieldProperties.comment,
          commentId:
            updatedFieldProperties.comment?.commentId || this.uiFormService.generateUniqueId()
        };
      }
    }

    if (updatedFieldProperties.type === FormFieldType.QE) {
      updatedFieldProperties.qeScales = updatedFieldProperties.qeScales?.map((scale: QeScale) => ({
        ...scale,
        id: scale.id || this.uiFormService.generateUniqueId(),
        qeScaleChildren: scale.qeScaleChildren?.map((child: QeScaleChild) => ({
          ...child,
          id: child.id || this.uiFormService.generateUniqueId()
        }))
      }));
    }

    this.propertiesSaved.emit(updatedFieldProperties);
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
