import { Component, OnInit } from '@angular/core';

import { FormOptionsMock } from 'src/app/models/form-constructor.model';
import { formOptionsMock } from 'src/app/constants/form-constants';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formOptionsFullObject: FormOptionsMock = formOptionsMock;
  formValue: any = null;

  constructor() {}

  ngOnInit() {}

  postFormValue(formData: any) {
    this.formValue = formData;
  }
}
