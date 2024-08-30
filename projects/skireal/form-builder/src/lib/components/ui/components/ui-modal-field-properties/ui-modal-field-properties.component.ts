import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { fieldsByType } from '../../../../constants/ui-constants';
import { FieldItem, FormField } from '../../../../models/form-constructor.model';
import { UiFormService } from '../../../../services/ui-form.service';

@Component({
  selector: 'app-ui-modal-field-properties',
  templateUrl: './ui-modal-field-properties.component.html',
  styleUrls: ['./ui-modal-field-properties.component.scss']
})
export class UIModalFieldPropertiesComponent implements OnInit {
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();
  @Input() enableSetValidationOptions = false;
  @Input() isSurvey = true;
  @Input() field: FormField = { id: '', name: '' };
  @Input() currentStep = 0;
  @Input() stepsLength = 1;

  propertyForm: FormGroup = this.fb.group({});
  selectedFieldType = '';
  fieldsToCreate: FormField[] = [];

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService
  ) {}

  ngOnInit() {
    this.selectedFieldType = this.field.type ?? '';
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

    const validatorsArray = this.propertyForm.get('validators') as FormArray;
    const optionsArray = this.propertyForm.get('options') as FormArray;
    const rowsArray = this.propertyForm.get('rows') as FormArray;
    const qeScalesArray = this.propertyForm.get('qeScales') as FormArray;

    this.patchArrayData(validatorsArray, this.field.validators);
    this.patchArrayData(optionsArray, this.field.options);
    this.patchArrayData(rowsArray, this.field.rows);
    this.patchArrayData(qeScalesArray, this.field.qeScales);
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
  closeModal() {
    this.modalRef.hide();
  }

  saveFieldProperties() {
    const updatedFieldProperties: FormField = {
      ...this.field,
      ...this.propertyForm.value
    };
    this.propertiesSave.emit(updatedFieldProperties);
    this.modalRef.hide();
  }
}
