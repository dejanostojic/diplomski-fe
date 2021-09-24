import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { SharedModule } from 'src/app/shared';
import { CityListComponent } from './pages/city-list/city-list.component';
import { CityFormComponent } from './pages/city-form/city-form.component';
import { CityDetailsComponent } from './pages/city-details/city-details.component';


@NgModule({
  declarations: [
    CityListComponent,
    CityFormComponent,
    CityDetailsComponent
    ],
  imports: [
    CommonModule,
    CityRoutingModule,
    SharedModule
  ]
})
export class CityModule { }
