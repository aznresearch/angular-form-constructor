import { Component, Input, OnInit } from '@angular/core';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {
  @Input() field: FormField = {} as FormField;

  constructor() {}

  ngOnInit(): void {}

  preventDefault(event: MouseEvent): void {
    event.preventDefault();
  }
}
