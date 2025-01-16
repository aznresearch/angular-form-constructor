import { Component, Input, OnInit } from '@angular/core';
import { FormField } from 'src/app/models/form-constructor.model';

@Component({
  selector: 'app-nps',
  templateUrl: './nps.component.html',
  styleUrls: ['./nps.component.scss']
})
export class NpsComponent implements OnInit {
  @Input() field: FormField = {} as FormField; // Поле формы с данными
  values: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  preventDefault(event: MouseEvent): void {
    event.preventDefault();
  }
}
