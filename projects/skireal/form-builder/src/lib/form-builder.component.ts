import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormDataStructure, FormOptionsFull } from './models/form-constructor.model';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormBuilderComponent {
  @Input() enableGeneralFields = true;
  @Input() enableConditionalLogicBlocks = false;
  @Input() isSurvey = true;
  @Input() incomingFormData: FormDataStructure;

  @Output() jsonCreated: EventEmitter<FormOptionsFull> = new EventEmitter<FormOptionsFull>();

  isShowResult = false;

  onFinishClicked($event: FormOptionsFull) {
    this.isShowResult = true;
    this.jsonCreated.emit($event);
  }
}
