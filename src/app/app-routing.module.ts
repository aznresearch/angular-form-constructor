import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './components/form-constructor/components/form/form.component';

const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: '**', redirectTo: '/form' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
