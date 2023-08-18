import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form-constructor/components/form/form.component';
import { AppRoutingModule } from './app-routing.module';
import { UIComponent } from './components/ui/ui.component';

@NgModule({
  declarations: [AppComponent, FormConstructorComponent, FormComponent, UIComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
