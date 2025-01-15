import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  @Input() field: FormField = {} as FormField;
  @Input() formGroup!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
