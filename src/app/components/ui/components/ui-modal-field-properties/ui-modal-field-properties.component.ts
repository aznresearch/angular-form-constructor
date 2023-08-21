import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormField } from 'src/app/models/form-constructor.model';

@Component({
  selector: 'app-ui-modal-field-properties',
  templateUrl: './ui-modal-field-properties.component.html',
  styleUrls: ['./ui-modal-field-properties.component.scss']
})
export class UIModalFieldPropertiesComponent implements OnInit {
  @Input() field: FormField = {};
  @Output() onPropertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();

  propertyForm: FormGroup = this.fb.group({});

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      validators: [''],
      classes: [''],
      placeholder: [''],
      name: ['']
    });

    this.propertyForm.patchValue({
      validators: this.field.validators,
      classes: this.field.classes,
      placeholder: this.field.placeholder,
      name: this.field.name
    });

    console.log(this.field);
  }

  closeModal() {
    this.modalRef.hide();
  }

  saveFieldProperties() {
    const updatedField: FormField = {
      ...this.field,
      validators: this.propertyForm.value.validators,
      classes: this.propertyForm.value.classes,
      placeholder: this.propertyForm.value.placeholder,
      name: this.propertyForm.value.name
    };
    this.onPropertiesSave.emit(updatedField);
    this.modalRef.hide();
  }
}
