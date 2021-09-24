import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityDetailsComponent } from './pages/city-details/city-details.component';
import { CityFormComponent } from './pages/city-form/city-form.component';
import { CityListComponent } from './pages/city-list/city-list.component';

const routes: Routes = [
  {path:'city-list', component:CityListComponent},
  {path:'city-form/:postalCode', component:CityFormComponent, data: {edit: true}},
  {path:'city-details/:postalCode', component:CityDetailsComponent},
  {path:'city-form', component:CityFormComponent, data: {edit: false}},
  {path:'', redirectTo:'city-list', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
