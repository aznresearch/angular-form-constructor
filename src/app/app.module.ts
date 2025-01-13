import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormComponent } from './components/form-constructor/components/form/form.component';
import { UIComponent } from './components/ui/ui.component';
import { UIFieldsInsertingComponent } from './components/ui/components/ui-fields-inserting/ui-fields-inserting.component';
import { UIFieldPropertiesComponent } from './components/ui/components/ui-field-properties/ui-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';
import { FormBuilderModule } from '@skireal/form-builder';

@NgModule({
  declarations: [
    AppComponent,
    FormConstructorComponent,
    FormComponent,
    UIComponent,
    UIFieldsInsertingComponent,
    UIFieldPropertiesComponent,
    FormFieldPropertiesComponent,
    ConfirmationDialogComponent,
    ConditionalLogicBlockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DragDropModule,
    FormBuilderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
