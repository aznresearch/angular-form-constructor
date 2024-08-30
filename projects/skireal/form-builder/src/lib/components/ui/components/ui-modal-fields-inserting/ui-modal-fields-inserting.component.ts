import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
import { SharedModalConfirmationComponent } from '../../../shared/shared-modal-confirmation/shared-modal-confirmation.component';

@Component({
  selector: 'app-ui-modal-fields-inserting',
  templateUrl: './ui-modal-fields-inserting.component.html',
  styleUrls: ['./ui-modal-fields-inserting.component.scss']
})
export class UIModalFieldsInsertingComponent implements OnInit {
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();
  @Input() isGeneral = false;
  @Input() enableSetValidationOptions = false;
  @Input() isSurvey = true;

  selectedFieldType!: FormFieldType;
  propertyForm: FormGroup = this.fb.group({});
  availableFieldTypes = formFieldTypes;
  fieldLabels: FieldTypesNames = fieldTypesNames;
  isFormCreated = false;
  fieldsToCreate: FormField[] = [];
  modalOptions = {
    initialState: {
      message: 'Are you sure you want to complete field creation without saving?'
    },
    class: 'modal-dialog-form-builder modal-dialog-form-builder--sm'
  };
  selectedFiledType = '';

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.setAvailableFieldTypes();
  }

  setAvailableFieldTypes() {
    if (this.isGeneral) {
      this.availableFieldTypes = [FormFieldType.Text, FormFieldType.Checkbox, FormFieldType.Select];
    } else if (this.isSurvey) {
      this.availableFieldTypes = surveyFieldTypes;
    } else {
      this.availableFieldTypes = formFieldTypes;
    }
  }

  selectField(fieldType: string) {
    this.selectedFiledType = fieldType;

    if (this.isFormCreated && this.selectedFieldType !== fieldType) {
      const modalRef = this.modalService.show(SharedModalConfirmationComponent, this.modalOptions);

      modalRef.content.confirm.subscribe((result: boolean) => {
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
        { name: 'Yes', value: 'true' },
        { name: 'No', value: 'false' }
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

    this.propertiesSave.emit(fieldProperties);
    this.modalRef.hide();
  }

  closeModal() {
    this.modalRef.hide();
  }
}
