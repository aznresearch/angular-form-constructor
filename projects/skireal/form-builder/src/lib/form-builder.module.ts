import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormBuilderComponent } from './form-builder.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { UIComponent } from './components/ui/ui.component';
import { UIFieldsInsertingComponent } from './components/ui/components/ui-fields-inserting/ui-fields-inserting.component';
import { UIFieldPropertiesComponent } from './components/ui/components/ui-field-properties/ui-field-properties.component';
import { FormFieldPropertiesComponent } from './components/ui/components/form-field-properties/form-field-properties.component';
import { ConditionalLogicBlockComponent } from './components/ui/components/conditional-logic-block/conditional-logic-block.component';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
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

@NgModule({
  declarations: [
    FormBuilderComponent,
    FormConstructorComponent,
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
    TextComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule],
  exports: [FormBuilderComponent],
  providers: [],
  bootstrap: [FormBuilderComponent],
  entryComponents: [
    UIFieldsInsertingComponent,
    UIFieldPropertiesComponent,
    ConditionalLogicBlockComponent
  ]
})
export class FormBuilderModule {}
