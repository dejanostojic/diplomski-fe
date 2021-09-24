import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMode } from 'src/app/core';
// import { CompetitionDetailsComponent } from './competition-details/climber-details.component';
import { CompetitionFormComponent } from './competition-form/competition-form.component';
import { CompetitionListComponent } from './competition-list/competition-list.component';

const routes: Routes = [
  {path:'competition-list', component:CompetitionListComponent},
  // {path:'competition-details/:id', component:CompetitionDetailsComponent},
  {path:'competition-form/:id/:mode', component:CompetitionFormComponent},
  {path:'competition-form', component:CompetitionFormComponent, data: {formMode:"FORM_ADD", customData: "CustomData"}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionRoutingModule { }
