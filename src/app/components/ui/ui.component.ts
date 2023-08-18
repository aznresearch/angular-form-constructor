import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  availableBlocks: FormField[] = [
    { key: 'text343', label: 'Text Field', type: 'input' },
    { key: 'date', label: 'Date Field', type: 'date' },
    {
      key: 'dropdown',
      label: 'Dropdown',
      type: 'dropdown',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }
  ];
  blockSelected: any[] = [];

  dynamicForm!: FormGroup;
  addedFields: FormField[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dynamicForm = new FormGroup({});
  }
  selectBlock(blockType: string) {
    const selectedBlock = this.availableBlocks.find((block) => block.type === blockType);

    if (selectedBlock) {
      this.addedFields.push(selectedBlock);
      console.log(this.addedFields);
      this.addControlToForm(selectedBlock);
    }
  }

  addControlToForm(field: FormField) {
    const control = new FormControl('');
    this.dynamicForm.addControl(field.key, control);
    console.log(this.dynamicForm);
  }
}
