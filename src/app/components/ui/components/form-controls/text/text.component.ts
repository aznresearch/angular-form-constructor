import { Component, Input, OnInit } from '@angular/core';
import { FormField } from 'src/app/models/form-constructor.model';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() field: FormField = {} as FormField;

  constructor() {}

  ngOnInit(): void {}

  preventDefault(event: MouseEvent): void {
    event.preventDefault();
  }
}
