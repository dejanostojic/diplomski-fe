import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompetitionRoutingModule } from './competition-routing.module';
import { SharedModule } from 'src/app/shared';
import { CompetitionListComponent } from './competition-list/competition-list.component';
// import { CompetitionDetailsComponent } from './competition-details/competition-details.component';
import { CompetitionFormComponent } from './competition-form/competition-form.component';
import { RegistrationFeeComponent } from './components/registration-fee/registration-fee.component';
import { RouteComponent } from './components/route/route.component';
import { RegistrationFeeModalComponent } from './components/registration-fee/registration-fee-modal/registration-fee-modal.component';
import { RouteModalComponent } from './components/route/route-modal/route-modal.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RegistrationModalComponent } from './components/registration/registration-modal/registration-modal.component';
import { ChooseClimberComponent } from './components/registration/registration-modal/climber-list/choose-climber.component';


@NgModule({
  declarations: [CompetitionListComponent, CompetitionFormComponent, RegistrationFeeComponent, RouteComponent, 
    RegistrationFeeModalComponent, RouteModalComponent, RegistrationComponent, RegistrationModalComponent, ChooseClimberComponent],
  imports: [
    CommonModule,
    CompetitionRoutingModule,
    SharedModule
  ]
})
export class CompetitionModule { }
