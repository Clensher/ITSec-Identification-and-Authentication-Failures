import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { AdmincheckinComponent } from './components/admincheckin/admincheckin.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { EntriesComponent } from './components/entries/entries.component';
import { CheckininfoComponent } from './components/checkininfo/checkininfo.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutinfoComponent } from './components/checkoutinfo/checkoutinfo.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { EditadminComponent } from './components/editadmin/editadmin.component';
import { EditentryComponent } from './components/editEntry/editentry.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { QRCodeModule } from 'angularx-qrcode';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    AdminhomeComponent,
    AdmincheckinComponent,
    CheckinComponent,
    EntriesComponent,
    CheckininfoComponent,
    CheckoutComponent,
    CheckoutinfoComponent,
    HomeComponent,
    LoginComponent,
    RegisterAdminComponent,
    EditadminComponent,
    EditentryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
