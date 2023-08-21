import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormFieldType } from 'src/app/constants/ui-constants';
import { UiFormService } from 'src/app/services/ui-form.service';

interface FormField {
  key?: string;
  label: string;
  type: string;
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'app-ui-modal-fields-inserting',
  templateUrl: './ui-modal-fields-inserting.component.html',
  styleUrls: ['./ui-modal-fields-inserting.component.scss']
})
export class UIModalFieldsInsertingComponent implements OnInit {
  @Output() onFieldSelect: EventEmitter<FormField> = new EventEmitter<FormField>();

  selectedFieldType = '';
  propertyForm: FormGroup = this.fb.group({});
  availableFieldTypes = Object.values(FormFieldType);

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService
  ) {}

  ngOnInit(): void {}

  selectField(fieldType: string) {
    const foundFieldType = this.availableFieldTypes.find((field) => field === fieldType);
    if (foundFieldType) {
      this.selectedFieldType = foundFieldType;
    }
    this.createPropertyForm();
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createPropertyForm();
  }

  saveFieldProperties() {
    const fieldProperties = this.uiFormService.saveFieldProperties(
      this.propertyForm,
      this.selectedFieldType
    );
    this.onFieldSelect.emit(fieldProperties);
    this.modalRef.hide();
  }
}
