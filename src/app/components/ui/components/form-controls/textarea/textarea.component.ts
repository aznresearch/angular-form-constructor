import { Component, Input, OnInit } from '@angular/core';
import { FormField } from 'src/app/models/form-constructor.model';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {
  @Input() field: FormField = {} as FormField;

  constructor() {}

  ngOnInit(): void {}

  preventDefault(event: MouseEvent): void {
    event.preventDefault();
  }
}
