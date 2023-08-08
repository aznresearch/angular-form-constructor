import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormField } from 'src/app/models/form-constructor.model';
import { FormConstructorService } from 'src/app/services/form-constructor.service';

@Component({
  selector: 'app-form-constructor',
  templateUrl: './form-constructor.component.html',
  styleUrls: ['./form-constructor.component.scss']
})
export class FormConstructorComponent implements OnInit {
  form: FormGroup;
  formFields: FormField[] = [
    { type: 'text', label: 'Имя', name: 'name', validators: [{ type: 'required' }] },
    { type: 'date', label: 'Дата рождения', name: 'birthdate', validators: [{ type: 'required' }] },
    {
      type: 'checkbox',
      label: 'Согласен с условиями',
      name: 'terms',
      validators: [{ type: 'required' }]
    },
    {
      type: 'dropdown',
      label: 'Страна',
      name: 'country',
      validators: [{ type: 'required' }],
      options: ['USA', 'Canada', 'UK']
    },
    {
      type: 'controlWithLabel',
      label: 'Описание',
      name: 'description',
      validators: [{ type: 'required' }, { type: 'minLength', value: 10 }]
    },
    {
      type: 'dropZone',
      label: 'Загрузить документ',
      name: 'document',
      validators: [{ type: 'required' }]
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private formConstructorService: FormConstructorService
  ) {}

  ngOnInit() {
    this.form = this.formConstructorService.buildForm(this.formFields);
  }

  onSubmit() {
    if (this.form.valid) {
      // Обработка результатов формы, например, отправка на сервер
      console.log(this.form.value);
    } else {
      // Вывод ошибок валидации
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
