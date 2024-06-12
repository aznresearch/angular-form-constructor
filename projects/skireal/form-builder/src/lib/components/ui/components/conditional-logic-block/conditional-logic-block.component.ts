import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FieldTypesNames,
  conditionOptions,
  defaultConditionalLogicBlock,
  fieldTypesNames
} from '../../../../constants/ui-constants';
import { ConditionalLogicBlock, FormField } from '../../../../models/form-constructor.model';

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

  isConditionInputVisible(): boolean {
    return (
      this.block.selectedCondition !== 'is empty' && this.block.selectedCondition !== 'is not empty'
    );
  }

  compareFields(field1: any, field2: any): boolean {
    return field1 && field2 && field1.id === field2.id;
  }
}
