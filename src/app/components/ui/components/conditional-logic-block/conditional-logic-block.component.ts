import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FieldTypesNames,
  conditionOptions,
  defaultConditionalLogicBlock,
  fieldTypesNames
} from 'src/app/constants/ui-constants';
import { ConditionalLogicBlock, FormField } from 'src/app/models/form-constructor.model';

@Component({
  selector: 'app-conditional-logic-block',
  templateUrl: './conditional-logic-block.component.html',
  styleUrls: ['./conditional-logic-block.component.scss']
})
export class ConditionalLogicBlockComponent implements OnInit {
  @Input() block: ConditionalLogicBlock = defaultConditionalLogicBlock;
  @Input() addedFields: FormField[] = [];
  @Output() remove = new EventEmitter<void>();

  fieldLabels: FieldTypesNames = fieldTypesNames;
  conditionOptions: Record<string, string[]> = conditionOptions;

  constructor() {}

  ngOnInit(): void {}

  removeConditionalLogicBlock() {
    this.remove.emit();
  }
}
