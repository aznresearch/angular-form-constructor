import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormConstructorComponent } from './components/form-constructor/form-constructor.component';
import { UIComponent } from './components/ui/ui.component';

const routes: Routes = [
  { path: 'finish', component: FormConstructorComponent },
  { path: 'form', component: UIComponent },
  { path: '**', redirectTo: '/form' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
