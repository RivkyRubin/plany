import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster/toaster.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isLoginOut = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return next.handle(req).pipe(
    //   catchError(err => {

    //            if (err instanceof HttpErrorResponse) {
    //         console.log('error:' + JSON.stringify(err));
    //         if (err.status !== 401) {
    //           //this.toaster.error('from interseptor ' + err.message);
    //          // return;   
    //             return  throwError(()=>err);
    //         }
    //         this.authService.doLogout();
    //         return throwError(()=>'stop');
    //       }
    //       return throwError(()=>{});
    // }),
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            console.log('error:' + JSON.stringify(err));
            if (err.status !== 401) {
              //this.toaster.error('from interseptor ' + err.message);
              return;
            }
            if(!this.isLoginOut)
            {
              this.isLoginOut=true;
              setInterval(()=>{
                this.isLoginOut = false;
              },2000)
            this.authService.doLogout();
            }
          }
        },
      }),
      tap((res) => {
        if (res['body'] != null && res['body']['statusCode'] != null) {
          if (res['body']['statusCode'] != 200) {
            this.toaster.error(res['body']['message']);
          }
        }
      })
    );
  }
}
