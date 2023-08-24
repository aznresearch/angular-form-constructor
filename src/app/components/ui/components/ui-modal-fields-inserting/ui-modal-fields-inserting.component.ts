import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedModalConfirmationComponent } from 'src/app/components/shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { fieldsToCreate, formFieldTypes } from 'src/app/constants/ui-constants';
import { FormField } from 'src/app/models/form-constructor.model';
import { UiFormService } from 'src/app/services/ui-form.service';

@Component({
  selector: 'app-ui-modal-fields-inserting',
  templateUrl: './ui-modal-fields-inserting.component.html',
  styleUrls: ['./ui-modal-fields-inserting.component.scss']
})
export class UIModalFieldsInsertingComponent implements OnInit {
  @Output() propertiesSave: EventEmitter<FormField> = new EventEmitter<FormField>();

  selectedFieldType = '';
  propertyForm: FormGroup = this.fb.group({});
  availableFieldTypes = formFieldTypes;
  isFormCreated = false;
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

  ngOnInit(): void {}

  selectField(fieldType: string) {
    if (this.isFormCreated) {
      const modalRef = this.modalService.show(SharedModalConfirmationComponent, this.modalOptions);

      modalRef.content.close.subscribe((result: boolean) => {
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
    this.createPropertyForm();
  }

  createPropertyForm() {
    this.propertyForm = this.uiFormService.createPropertyForm(fieldsToCreate);
    this.isFormCreated = true;
  }

  saveFieldProperties() {
    const fieldProperties = this.uiFormService.saveFieldProperties(
      this.propertyForm,
      this.selectedFieldType
    );
    console.log(fieldProperties);

    this.propertiesSave.emit(fieldProperties);
    this.modalRef.hide();
  }

  closeModal() {
    this.modalRef.hide();
  }
}
