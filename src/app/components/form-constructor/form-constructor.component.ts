import { Component, OnInit } from '@angular/core';
import { StepData } from 'src/app/models/form-constructor.model';
import { FormConstructorService } from 'src/app/services/form-constructor.service';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formValue: any = null;

  formData: StepData[] = [];

  constructor(
    private formConstructorService: FormConstructorService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    this.formData = this.formDataService.getFormData();

    this.formConstructorService.getFormValue().subscribe((formData) => {
      this.formValue = formData;
    });
  }
}
