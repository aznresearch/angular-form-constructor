import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { FormOptionsFull } from 'src/app/models/form-constructor.model';
import { FormDataService } from 'src/app/services/form-data.service';
import { defaultFormOptionsObject } from 'src/app/constants/form-constants';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formValue: any = null;

  formOptionsFull: FormOptionsFull = defaultFormOptionsObject;
  constructor(
    private formDataService: FormDataService,

    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    console.log(this);

    this.formDataService.getFormData().subscribe((data) => {
      this.formOptionsFull = data;
    });
  }

  copyFormData() {
    const formDataString = JSON.stringify(this.formOptionsFull);
    this.clipboard.copy(formDataString);
    alert('Form data copied to clipboard!');
  }
}
