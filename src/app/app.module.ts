import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { UIComponent } from './components/ui/ui.component';
import { UIFieldsInsertingComponent } from './components/ui/components/ui-fields-inserting/ui-fields-inserting.component';
import { UIFieldPropertiesComponent } from './components/ui/components/ui-field-properties/ui-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';
import { FormBuilderModule } from '@skireal/form-builder';
import { TextareaComponent } from './components/ui/components/form-controls/textarea/textarea.component';
import { SelectComponent } from './components/ui/components/form-controls/select/select.component';
import { CheckboxGroupComponent } from './components/ui/components/form-controls/checkbox-group/checkbox-group.component';
import { CheckboxComponent } from './components/ui/components/form-controls/checkbox/checkbox.component';
import { RadioComponent } from './components/ui/components/form-controls/radio/radio.component';
import { LikertComponent } from './components/ui/components/form-controls/likert/likert.component';
import { CsatComponent } from './components/ui/components/form-controls/csat/csat.component';
import { NpsComponent } from './components/ui/components/form-controls/nps/nps.component';
import { QeComponent } from './components/ui/components/form-controls/qe/qe.component';
import { TextComponent } from './components/ui/components/form-controls/text/text.component';
import { IsFieldUniquePipe } from './pipes/is-field-unique.pipe';
import { LocalizedPipe } from './pipes/localized.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UIComponent,
    UIFieldsInsertingComponent,
    UIFieldPropertiesComponent,
    FormFieldPropertiesComponent,
    ConfirmationDialogComponent,
    ConditionalLogicBlockComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxGroupComponent,
    CheckboxComponent,
    RadioComponent,
    LikertComponent,
    CsatComponent,
    NpsComponent,
    QeComponent,
    TextComponent,
    IsFieldUniquePipe,
    LocalizedPipe
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
