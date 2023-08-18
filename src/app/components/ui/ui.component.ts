import { Component, OnInit, Type } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UIModalFieldsInsertingComponent } from './components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';

interface FormField {
  key: string;
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
    this.dynamicForm.addControl(field.key, control);
    console.log(this.dynamicForm);
  }

  openFieldsInsertingModal() {
    this.openModal(UIModalFieldsInsertingComponent);
    this.modalRef?.content.onBlockSelect.subscribe((selectedBlock: FormField) => {
      if (selectedBlock) {
        this.addedFields.push(selectedBlock);
        this.addControlToForm(selectedBlock);
      }
    });
  }

  openModal(component: Type<any>) {
    this.modalRef = this.modalService.show(component, {
      class: 'modal-dialog-centered'
    });
  }
}
