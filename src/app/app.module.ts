import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormComponent } from './components/form-constructor/components/form/form.component';
import { UIComponent } from './components/ui/ui.component';
import { UIModalFieldsInsertingComponent } from './components/ui/components/ui-modal-fields-inserting/ui-modal-fields-inserting.component';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UIModalFieldPropertiesComponent } from './components/ui/components/ui-modal-field-properties/ui-modal-field-properties.component';

@NgModule({
  declarations: [
    AppComponent,
    FormConstructorComponent,
    FormComponent,
    UIComponent,
    UIModalFieldsInsertingComponent,
    UIModalFieldPropertiesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    DragDropModule
  ],
  providers: [BsModalRef],
  bootstrap: [AppComponent]
})
export class AppModule {}
