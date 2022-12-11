import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { ILoginResponse } from 'src/app/shared/models/login-response.model';
import { ApiResponse, IApiResponse } from '../models/apiResponse.model';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { IExternalAuth } from 'src/app/shared/models/external-auth';
import { FormGroup } from '@angular/forms';
import { ResetPassword } from 'src/app/features/account/models/reset-password';
import { ToasterService } from './toaster/toaster.service';
import { ConfirmAccount } from 'src/app/features/account/models/confirm-account';
import { ApiResponseCode } from 'src/app/shared/enums/statusCode.enum';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  isLoggedIn = new BehaviorSubject(false);
  isExternalLoggedIn = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    public router: Router,
    private externalAuthService: SocialAuthService,
    private toaster:ToasterService
  ) {
    this.externalAuthService.authState.subscribe((user) => {
      console.log(user);
      this.extAuthChangeSub.next(user);
    });
  }
  signUp(user: User): Observable<any> {
    let api = `${environment.apiKey}/account/register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }
  setTokenFromSignIn(data: ILoginResponse) {
    localStorage.setItem('token', data.token);
    this.isLoggedIn.next(true);
  }

  signIn(user: User) {
    return this.http
      .post<any>(`${environment.apiKey}/account/signin`, user)
      .subscribe((res: IApiResponse<ILoginResponse>) => {
        if (res.statusCode == 200) {
          this.setTokenFromSignIn(res.data);
          this.getUserProfile().subscribe((res) => {
            console.log('current user:' + JSON.stringify(res));
            this.currentUser = res;
            this.router.navigate(['events']);
          });
        }
        else if(res.responseCode==ApiResponseCode.EmailNotConfirmed){
          this.toaster.error(res.message, 10000, 'Resend confirmation email', () => {
            this.sendEmailConfirmation(user.email).subscribe();
          });
        }
        // else this.toaster.error('from here '+res.message);
      });
  }
  getToken() {
    return localStorage.getItem('token');
  }
  hasToken() {
    return localStorage.getItem('token') != null;
  }
  // get isLoggedIn(): boolean {
  //   let authToken = localStorage.getItem('token');
  //   return authToken !== null ? true : false;
  // }
  doLogout() {
    let removeToken = localStorage.removeItem('token');
    if (removeToken == null) { 
          this.signOutExternal();
      this.isLoggedIn.next(false);
      this.router.navigate(['login']);
 
    }
  }
  // User profile
  getUserProfile(): Observable<any> {
    let api = `${environment.apiKey}/account/userProfile`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      })
      
    );
  }

  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();
  public authChanged = this.authChangeSub.asObservable();
  public extAuthChanged = this.extAuthChangeSub.asObservable();

  public signInWithGoogle = () => {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  };
  public signOutExternal = () => {
    if(this.isExternalLoggedIn.getValue())
    this.externalAuthService.signOut();
  };

  public externalLogin = (body: IExternalAuth) => {
    return this.http
      .post<any>(`${environment.apiKey}/account/externalLogin`, body)
      .subscribe({
        next: (res: IApiResponse<ILoginResponse>) => {
          if (res.statusCode == 200) {
            this.setTokenFromSignIn(res.data);
            this.isExternalLoggedIn.next(true);
            this.router.navigate(['events']);
          }
          else{
            this.toaster.error(res.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          alert('error');
          this.signOutExternal();
        },
      });
    };

    sendPasswordResetLink(email:string) {
      return this.http.get<IApiResponse<boolean>>(`${environment.apiKey}/account/ForgotPassword`, {
        params: {
          email: email
        }
      }).pipe(map(res => res.data),retry(1), catchError(this.handleError));;
    }
  
    //ResetPassword : API
    resetUserPassword(body:ResetPassword) {
      return this.http.post<IApiResponse<boolean>>(`${environment.apiKey}/account/ResetPassword`, body).pipe(map(res => {
        if(res.statusCode!=200)
      {
        this.toaster.error(res.message);
        return false;
      }
      else{
        this.toaster.success('The Password changed successfully');
        return true;
      }
      }),retry(1), catchError(this.handleError));
    }

    sendEmailConfirmation(emailAddress:string) {
      return this.http.get<IApiResponse<boolean>>(`${environment.apiKey}/account/SendEmailConfirmation/`+ emailAddress).pipe(map(res => {
        if(res.statusCode!=200)
      {
        this.toaster.error(res.message);
        return false;
      }
      else{
        this.toaster.success('Email was sent, please check your inbox');
        return true;
      }
      }),retry(1), catchError(this.handleError));
    }

    confirmAccount(body:ConfirmAccount) {
      return this.http.get<IApiResponse<boolean>>(`${environment.apiKey}/account/ConfirmEmail`, {
        params: {
          userId: body.UserID,
          code: body.Code
        }
      }).pipe(retry(1), catchError(this.handleError));
    }

  // Error
  handleError(error: HttpErrorResponse) {
    console.log('error!' + JSON.stringify(error));
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //return throwError(msg);
    console.log('error: ' + msg);
    return throwError(() => error.error);
  }
}
