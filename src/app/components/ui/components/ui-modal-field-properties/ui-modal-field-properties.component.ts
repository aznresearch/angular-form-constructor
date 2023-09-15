import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { fieldsToCreate } from 'src/app/constants/ui-constants';
import { FormField, Option, Validator } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-ui-modal-field-properties',
  templateUrl: './ui-modal-field-properties.component.html',
  styleUrls: ['./ui-modal-field-properties.component.scss']
})
export class UIModalFieldPropertiesComponent implements OnInit {
  @Input() field: FormField = { id: '', name: '' };
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();

  propertyForm: FormGroup = this.fb.group({});
  selectedFieldType = '';
  fieldsToCreate: FormField[] = [];

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService
  ) {}

  ngOnInit(): void {
    this.selectedFieldType = this.field.type ?? '';
    this.uiFormService.setFieldsToCreate(this.selectedFieldType);
    this.createPropertyForm();
    this.patchFieldProperties();
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createFormGroup(fieldsToCreate);
  }

  patchFieldProperties() {
    this.propertyForm.patchValue(this.field);

    const validatorsArray = this.propertyForm.get('validators') as FormArray;
    const optionsArray = this.propertyForm.get('options') as FormArray;

    this.patchArrayData(validatorsArray, this.field.validators);
    this.patchArrayData(optionsArray, this.field.options);
  }

  patchArrayData(array: FormArray, data: (Validator | Option)[] | undefined) {
    if (data) {
      data.forEach((item: Validator | Option) => {
        array.push(this.fb.group(item));
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
