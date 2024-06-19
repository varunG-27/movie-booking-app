import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './component/home/home.component';
import { BookingComponent } from './component/booking/booking.component';
import { AdminComponent } from './component/admin/admin.component';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'booking/:movieName', component: BookingComponent, canActivate: [AuthGuard] , data: { role: 'ROLE_ADMIN' }},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'forgetpassword', component: ForgetpasswordComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }, // Handle invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
