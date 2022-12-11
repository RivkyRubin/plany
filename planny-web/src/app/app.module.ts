import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { SigninComponent } from './shared/components/signin/signin.component';
import { SignupComponent } from './shared/components/signup/signup.component';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';
import { HomeComponent } from './features/general/home/home.component';
import { SplashScreenStateService } from './core/services/splash-screen-state.service';
import { SplashScreenComponent } from './core/components/splash-screen/splash-screen.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomErrorHandler } from './core/services/custom-error-handler.service';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ForgotPasswordDialogComponent } from './features/account/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PasswordResetComponent } from './features/account/password-reset/password-reset.component';
import { AccountActivationComponent } from './features/account/account-activation/account-activation.component';
import { environment } from 'src/environments/environment';
import { AboutComponent } from './features/general/about/about.component';
import { InView } from './shared/directives/in-view.directive';
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    UserProfileComponent,
    HomeComponent,
    SplashScreenComponent,
    NavbarComponent,
    ForgotPasswordDialogComponent,
    PasswordResetComponent,
    AccountActivationComponent,
    AboutComponent,
    InView
    ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    SocialLoginModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },
    SplashScreenStateService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            // provider: new GoogleLoginProvider(
            //   'your client id', {
            //     scope: 'email',
            //     plugin_name: 'the name of the Google OAuth project you created'
            //   }
            // )
            provider: new GoogleLoginProvider(
              environment.googleKey 
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
