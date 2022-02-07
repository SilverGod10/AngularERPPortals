import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashComponent } from '../customer-dash/customer-dash.component';

import { CustomerLoginComponent } from '../customer-login/customer-login.component';
import { EmployeeDashboardComponent } from '../employee-dashboard/employee-dashboard.component';
import { EmployeeLoginComponent } from '../employee-login/employee-login.component';
import { AuthGuard } from '../guards/auth.guard';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { VendorDashboardComponent } from '../vendor-dashboard/vendor-dashboard.component';
import { VendorLoginComponent } from '../vendor-login/vendor-login.component';

const routes: Routes = [
  //{ path: 'login', component: CustomerLoginComponent,canActivate:[AuthGuard] },
  { path: 'customer-dashboard', component: CustomerDashComponent ,canActivate:[AuthGuard]},
  { path : 'customer-login', component : CustomerLoginComponent},
  { path : '', component : LandingPageComponent},
  { path : 'vendor-login', component : VendorLoginComponent},
  { path : 'vendor-dashboard', component : VendorDashboardComponent,canActivate:[AuthGuard]},
  { path : 'employee-login', component : EmployeeLoginComponent},
  { path : 'employee-dashboard', component : EmployeeDashboardComponent,canActivate:[AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(){}

}
