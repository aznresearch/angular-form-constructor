import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedModalConfirmationComponent } from 'src/app/components/shared/shared-modal-confirmation/shared-modal-confirmation.component';
import {
  fieldsByType,
  formFieldTypes,
  defaultOptionValues,
  FieldTypesNames,
  fieldTypesNames,
  haveOptionsFieldTypes,
  FormFieldType
} from 'src/app/constants/ui-constants';
import { FormField } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-ui-modal-fields-inserting',
  templateUrl: './ui-modal-fields-inserting.component.html',
  styleUrls: ['./ui-modal-fields-inserting.component.scss']
})
export class UIModalFieldsInsertingComponent implements OnInit {
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();

  isGeneral = false;
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
    class: 'modal-md'
  };

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.setAvailableFieldTypes();
  }

  setAvailableFieldTypes() {
    if (this.isGeneral) {
      this.availableFieldTypes = [FormFieldType.Text, FormFieldType.Checkbox, FormFieldType.Select];
    } else {
      this.availableFieldTypes = formFieldTypes;
    }
  }

  selectField(fieldType: string) {
    if (this.isFormCreated) {
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
    if (this.selectedFieldType === 'radio-boolean') {
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
