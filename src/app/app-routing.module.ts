import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch:'full'},
  { path: 'login', component: LoginComponent },
  {
    path: 'city',
    loadChildren: () =>
      import('./features/city/city.module').then((m) => m.CityModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'climber',
    loadChildren: () =>
      import('./features/climber/climber.module').then((m) => m.ClimberModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'competition',
    loadChildren: () =>
      import('./features/competition/competition.module').then((m) => m.CompetitionModule),
    canActivate: [AuthGuard],
  },
  { path: 'home',
    loadChildren: () =>
    import('./features/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard], }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
