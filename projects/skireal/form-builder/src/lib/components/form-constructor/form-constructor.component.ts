import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { FormOptionsFull } from '../../models/form-constructor.model';
import { FormDataService } from '../../services/form-data.service';
import { defaultFormOptionsObject } from '../../constants/form-constants';
import { FormConstructorService } from '../../services/form-constructor.service';

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
    private clipboard: Clipboard,
    private formConstructorService: FormConstructorService
  ) {}

  ngOnInit() {
    this.formDataService.getFormData().subscribe((data) => {
      this.formOptionsFull = data;
    });

    this.formConstructorService.getFormValue().subscribe((formData) => {
      this.formValue = formData;
    });
  }

  copyFormData() {
    const formDataString = JSON.stringify(this.formOptionsFull);
    this.clipboard.copy(formDataString);
    alert('Form data copied to clipboard!');
  }
}
