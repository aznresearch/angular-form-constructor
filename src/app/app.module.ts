import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyConstructorComponent } from './components/survey-constructor/survey-constructor.component';

@NgModule({
  declarations: [AppComponent, FormConstructorComponent, SurveyConstructorComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
