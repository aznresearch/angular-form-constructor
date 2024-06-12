import { Component } from '@angular/core';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent {
  title = 'formBuilder';
  isShowResult = false;

  onFinishClicked() {
    this.isShowResult = true;
  }
}
