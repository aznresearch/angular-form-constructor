import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormBuilderComponent } from './form-builder.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { UIComponent } from './components/ui/ui.component';
import { UIFieldsInsertingComponent } from './components/ui/components/ui-fields-inserting/ui-fields-inserting.component';
import { UIFieldPropertiesComponent } from './components/ui/components/ui-field-properties/ui-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { SharedModalConfirmationComponent } from './components/shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormConstructorComponent,
    UIComponent,
    UIFieldsInsertingComponent,
    UIFieldPropertiesComponent,
    FormFieldPropertiesComponent,
    SharedModalConfirmationComponent,
    ConditionalLogicBlockComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule, DragDropModule],
  exports: [FormBuilderComponent],
  providers: [BsModalRef],
  bootstrap: [FormBuilderComponent],
  entryComponents: [
    UIFieldsInsertingComponent,
    UIFieldPropertiesComponent,
    SharedModalConfirmationComponent,
    ConditionalLogicBlockComponent
  ]
})
export class FormBuilderModule {}
