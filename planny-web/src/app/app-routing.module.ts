import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotLoggedInGuard } from './core/guards/not-logged-in.guard';
import { AccountActivationComponent } from './features/account/account-activation/account-activation.component';
import { PasswordResetComponent } from './features/account/password-reset/password-reset.component';
import { AboutComponent } from './features/general/about/about.component';
import { HomeComponent } from './features/general/home/home.component';
import { SigninComponent } from './shared/components/signin/signin.component';
import { SignupComponent } from './shared/components/signup/signup.component';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent, canActivate: [NotLoggedInGuard]  },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'account-activation', component: AccountActivationComponent },
  { path: 'signup', component: SignupComponent, canActivate: [NotLoggedInGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(x => x.EventsModule)

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
