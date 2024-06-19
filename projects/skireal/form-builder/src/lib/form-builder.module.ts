import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormBuilderComponent } from './form-builder.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { UIComponent } from './components/ui/ui.component';
import { UIModalFieldsInsertingComponent } from './components/ui/components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui/components/ui-modal-field-properties/ui-modal-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { SharedModalConfirmationComponent } from './components/shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormConstructorComponent,
    UIComponent,
    UIModalFieldsInsertingComponent,
    UIModalFieldPropertiesComponent,
    FormFieldPropertiesComponent,
    SharedModalConfirmationComponent,
    ConditionalLogicBlockComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, ModalModule.forRoot(), DragDropModule],
  exports: [FormBuilderComponent],
  providers: [BsModalRef],
  bootstrap: [FormBuilderComponent]
})
export class FormBuilderModule {}
