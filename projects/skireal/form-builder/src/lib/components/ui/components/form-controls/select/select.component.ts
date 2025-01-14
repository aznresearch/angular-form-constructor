import { Component, Input, OnInit } from '@angular/core';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() field: FormField = {} as FormField;
  @Input() hasOptions = false;

  constructor() {}

  ngOnInit(): void {}

  preventDefault(event: MouseEvent): void {
    if (!this.hasOptions) {
      event.preventDefault();
    }
  }
}
