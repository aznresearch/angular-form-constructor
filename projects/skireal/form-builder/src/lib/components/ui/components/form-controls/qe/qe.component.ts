import { Component, Input, OnInit } from '@angular/core';
import { FormField } from '../../../../../models/form-constructor.model';

@Component({
  selector: 'app-qe',
  templateUrl: './qe.component.html',
  styleUrls: ['./qe.component.scss']
})
export class QeComponent implements OnInit {
  @Input() field: FormField = {} as FormField;
  scaleValues: (number | string)[] = [];

  constructor() {}

  ngOnInit(): void {
    this.scaleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'N/A'];
  }
}
