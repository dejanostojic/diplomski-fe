import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMode } from 'src/app/core';
import { ClimberDetailsComponent } from './climber-details/climber-details.component';
import { ClimberFormComponent } from './climber-form/climber-form.component';
import { ClimberListComponent } from './climber-list/climber-list.component';

const routes: Routes = [
  {path:'climber-list', component:ClimberListComponent},
  {path:'climber-details/:id', component:ClimberDetailsComponent},
  {path:'climber-form/:id/:mode', component:ClimberFormComponent},
  {path:'climber-form', component:ClimberFormComponent, data: {formMode:"FORM_ADD", customData: "CustomData"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClimberRoutingModule { }
