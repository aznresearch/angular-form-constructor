import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
  onBlockSelect: EventEmitter<FormField> = new EventEmitter<FormField>();

  availableBlocks: FormField[] = [
    { key: '', label: 'Text Field', type: 'input' },
    { key: 'date', label: 'Date Field', type: 'date' },
    {
      key: 'dropdown',
      label: 'Dropdown',
      type: 'select',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
  ];
  blockSelected: any[] = [];

  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {}

  selectBlock(blockType: string) {
    const selectedBlock = this.availableBlocks.find((block) => block.type === blockType);
    if (selectedBlock) {
      selectedBlock.key = selectedBlock.key || this.generateUniqueId().toString();
      this.onBlockSelect.emit(selectedBlock);
      this.modalRef.hide();
    }
  }

  generateUniqueId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
