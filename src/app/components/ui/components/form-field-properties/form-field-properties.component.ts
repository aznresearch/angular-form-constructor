import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field-properties',
  templateUrl: './form-field-properties.component.html',
  styleUrls: ['./form-field-properties.component.scss']
})
export class FormFieldPropertiesComponent implements OnInit {
  @Input() propertyForm?: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
