import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'checkin', component: CheckinComponent},
  {path: 'checkininfo', component: CheckininfoComponent},
  {path: 'entries', component: EntriesComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'checkoutinfo', component: CheckoutinfoComponent},
  {path: 'registeradmin', component: RegisterAdminComponent},
  {path: 'login', component: LoginComponent},
  {path: 'adminhome', component: AdminhomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admincheckin', component: AdmincheckinComponent},
  {path: 'editadmin', component: EditadminComponent},
  {path: 'editentry', component: EditentryComponent},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
