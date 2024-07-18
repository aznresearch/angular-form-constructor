import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent {
  @Input() enableGeneralFields = true;
  @Input() enableConditionalLogicBlocks = false;
  @Input() isSurvey = true;

  isShowResult = false;

  onFinishClicked() {
    this.isShowResult = true;
  }
}
