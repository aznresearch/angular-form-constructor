import { Component, Input, OnInit } from '@angular/core';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() field: FormField = {} as FormField;

  constructor() {}

  ngOnInit(): void {}
}
