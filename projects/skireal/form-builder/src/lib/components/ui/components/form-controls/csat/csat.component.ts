import { Component, Input, OnInit } from '@angular/core';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-csat',
  templateUrl: './csat.component.html',
  styleUrls: ['./csat.component.scss']
})
export class CsatComponent implements OnInit {
  @Input() field: FormField = {} as FormField;
  values: (number | string)[] = [];

  constructor() {}

  ngOnInit(): void {
    this.values = this.getValuesForCsat(this.field);
  }

  getValuesForCsat(field: FormField): (number | string)[] {
    const values: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (field.hasNA) {
      values.push('N/A');
    }
    return values;
  }
}
