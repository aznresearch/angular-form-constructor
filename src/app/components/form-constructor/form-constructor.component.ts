import { Component, OnInit } from '@angular/core';
import { FormConstructorService } from 'src/app/services/form-constructor.service';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  formValue: any = null;

  constructor(private formConstructorService: FormConstructorService) {}

  ngOnInit() {
    this.formConstructorService.getFormValue().subscribe((formData) => {
      this.formValue = formData;
    });
  }
}
