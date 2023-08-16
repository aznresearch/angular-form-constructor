import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formValue: any = null;

  constructor() {}

  ngOnInit() {}

  postFormValue(formData: any) {
    this.formValue = formData;
  }
}
