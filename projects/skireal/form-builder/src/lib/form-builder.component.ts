import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormOptionsFull } from './models/form-constructor.model';

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
  @Input() incomingFormData = '';
  @Input() enableSetValidationOptions = false;

  @Output() jsonCreated: EventEmitter<string> = new EventEmitter<string>();

  formData: FormOptionsFull = {
    formData: {
      steps: [],
      generalFields: []
    },
    options: {
      name: '',
      type: '',
      country: ''
    },
    uniqueFormData: []
  };

  ngOnInit() {
    this.formData = JSON.parse(this.incomingFormData);
  }

  onSaveClicked($event: FormOptionsFull) {
    const jsonData = JSON.stringify($event);
    this.jsonCreated.emit(jsonData);
  }
}
