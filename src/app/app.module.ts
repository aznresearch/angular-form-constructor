import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormComponent } from './components/form-constructor/components/form/form.component';
import { UIComponent } from './components/ui/ui.component';
import { UIModalFieldsInsertingComponent } from './components/ui/components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { UIModalFieldPropertiesComponent } from './components/ui/components/ui-modal-field-properties/ui-modal-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { SharedModalConfirmationComponent } from './components/shared/shared-modal-confirmation/shared-modal-confirmation.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';
import { FormBuilderModule } from '@skireal/form-builder';

@NgModule({
  declarations: [
    AppComponent,
    FormConstructorComponent,
    FormComponent,
    UIComponent,
    UIModalFieldsInsertingComponent,
    UIModalFieldPropertiesComponent,
    FormFieldPropertiesComponent,
    SharedModalConfirmationComponent,
    ConditionalLogicBlockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    DragDropModule,
    FormBuilderModule
  ],
  providers: [BsModalRef],
  bootstrap: [AppComponent]
})
export class AppModule {}
