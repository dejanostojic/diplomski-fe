import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMode } from 'src/app/core';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [
  {path:'admin-list', component:AdminListComponent},
  {path:'admin-form/:id/:mode', component:AdminFormComponent},
  {path:'admin-form', component:AdminFormComponent, data: {formMode:"FORM_ADD", customData: "CustomData"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
