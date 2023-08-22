import { Component, OnInit, Type } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UIModalFieldPropertiesComponent } from './components/ui-modal-field-properties/ui-modal-field-properties.component';

interface FormField {
  name: string;
  id: string;
  label: string;
  type: string;
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UIComponent implements OnInit {
  modalRef: BsModalRef | undefined;

  dynamicForm!: FormGroup;
  addedFields: FormField[] = [];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.dynamicForm = new FormGroup({});
  }

  addControlToForm(field: FormField) {
    const control = new FormControl('');
    this.dynamicForm.addControl(field.id, control);
  }

  openFieldsInsertingModal() {
    this.openModal(UIModalFieldsInsertingComponent);
    this.modalRef?.content.fieldSelect.subscribe((selectedField: FormField) => {
      if (selectedField) {
        this.addedFields.push(selectedField);
        this.addControlToForm(selectedField);
      }
    });
  }

  openFieldPropertiesModal(field: FormField) {
    const initialState = {
      field
    };

    this.openModal(UIModalFieldPropertiesComponent, initialState);

    this.modalRef?.content.propertiesSave.subscribe((updatedField: FormField) => {
      if (updatedField) {
        const index = this.addedFields.indexOf(field);
        if (index !== -1) {
          this.addedFields[index] = updatedField;
        }
      }
    });
  }

  openModal(component: Type<any>, initialState?: any) {
    this.modalRef = this.modalService.show(component, {
      initialState,
      class: 'modal-dialog-centered'
    });
  }

  removeField(field: FormField) {
    const index = this.addedFields.indexOf(field);
    if (index !== -1) {
      this.addedFields.splice(index, 1);
      this.dynamicForm.removeControl(field.name);
    }
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.addedFields, event.previousIndex, event.currentIndex);
  }
}
