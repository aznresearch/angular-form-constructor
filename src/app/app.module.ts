import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyConstructorComponent } from './components/survey-constructor/survey-constructor.component';
import { FormComponent } from './components/form-constructor/components/form/form.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, FormConstructorComponent, SurveyConstructorComponent, FormComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
