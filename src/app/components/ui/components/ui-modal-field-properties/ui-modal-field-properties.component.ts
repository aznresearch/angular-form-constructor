import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormField } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-ui-modal-field-properties',
  templateUrl: './ui-modal-field-properties.component.html',
  styleUrls: ['./ui-modal-field-properties.component.scss']
})
export class UIModalFieldPropertiesComponent implements OnInit {
  @Input() field: FormField = {};
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();

  propertyForm: FormGroup = this.fb.group({});

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private uiFormService: UiFormService
  ) {}

  ngOnInit(): void {
    this.createPropertyForm();
    this.patchFieldProperties();
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createPropertyForm();
  }

  patchFieldProperties() {
    this.propertyForm.patchValue(this.field);
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
