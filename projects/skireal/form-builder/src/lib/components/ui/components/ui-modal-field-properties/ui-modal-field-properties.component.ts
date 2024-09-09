import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { arrayProperties, fieldsByType } from '../../../../constants/ui-constants';
import {
  FieldItem,
  FormField,
  Option,
  QeScale,
  QeScaleChild,
  Comment
} from '../../../../models/form-constructor.model';
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
  closeModal() {
    this.modalRef.hide();
  }

  saveFieldProperties() {
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

    if (updatedFieldProperties.type === 'nps') {
      updatedFieldProperties.comment = updatedFieldProperties.comment?.map((comment: Comment) => ({
        ...comment,
        id: comment.commentId || this.uiFormService.generateUniqueId()
      }));
    }

    if (updatedFieldProperties.type === 'qe') {
      updatedFieldProperties.qeScales = updatedFieldProperties.qeScales?.map((scale: QeScale) => ({
        ...scale,
        id: scale.id || this.uiFormService.generateUniqueId(),
        qeScaleChildren: scale.qeScaleChildren?.map((child: QeScaleChild) => ({
          ...child,
          id: child.id || this.uiFormService.generateUniqueId()
        }))
      }));
    }

    this.propertiesSave.emit(updatedFieldProperties);
    this.modalRef.hide();
  }
}
