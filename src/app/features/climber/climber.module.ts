import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClimberRoutingModule } from './climber-routing.module';
import { SharedModule } from 'src/app/shared';
import { ClimberListComponent } from './climber-list/climber-list.component';
import { ClimberDetailsComponent } from './climber-details/climber-details.component';
import { ClimberFormComponent } from './climber-form/climber-form.component';


@NgModule({
  declarations: [ClimberListComponent, ClimberDetailsComponent, ClimberFormComponent],
  imports: [
    CommonModule,
    ClimberRoutingModule,
    SharedModule
  ]
})
export class ClimberModule { }
