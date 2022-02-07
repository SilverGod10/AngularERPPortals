import { HttpClientModule, HttpParams } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule ,Title } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';

import { AppRoutingModule } from './core/app-routing.module';
import { MaterialModule } from './core/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AgGridModule } from 'ag-grid-angular';


import { AppComponent } from './app.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerDashComponent } from './customer-dash/customer-dash.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
@NgModule({
  declarations: [
    AppComponent,
    CustomerLoginComponent,
    CustomerDashComponent,
    VendorLoginComponent,
    VendorDashboardComponent,
    EmployeeLoginComponent,
    EmployeeDashboardComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDZapsU9v_thkTTDqZ6K64sygDNy0BbJCA",
      authDomain: "ak-cp-6e11c.firebaseapp.com",
      projectId: "ak-cp-6e11c",
      storageBucket: "ak-cp-6e11c.appspot.com"
    }),
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [AuthGuard , Title],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){}

 }
