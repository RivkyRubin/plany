// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { AuthenticatedResponse } from '../models/authenticated-response.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate  {

//   constructor(private router:Router, private jwtHelper: JwtHelperService, private http: HttpClient){}
  
//   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const token = localStorage.getItem("jwt")|| '{}';

//     if (token && !this.jwtHelper.isTokenExpired(token)){
//       console.log(this.jwtHelper.decodeToken(token))
//       return true;
//     }

//     const isRefreshSuccess = await this.tryRefreshingTokens(token); 
//     if (!isRefreshSuccess) { 
//       this.router.navigate(["login"]); 
//     }

//     return isRefreshSuccess;
//   }

//   private async tryRefreshingTokens(token: string): Promise<boolean> {
//     // Try refreshing tokens using refresh token
//     const refreshToken: string = localStorage.getItem("refreshToken") || '{}';
//     if (!token || !refreshToken) { 
//       return false;
//     }
    
//     const credentials = JSON.stringify({ authenticationToken: token, refreshToken: refreshToken });
//     let isRefreshSuccess: boolean;

//     const refreshRes = await new Promise<AuthenticatedResponse>((resolve, reject) => {
//       this.http.post<AuthenticatedResponse>("https://localhost:7048/api/account/RefreshToken", credentials, {
//         headers: new HttpHeaders({
//           "Content-Type": "application/json"
//         })
//       }).subscribe({
//         next: (res: AuthenticatedResponse) => resolve(res),
//         error: (_) => { reject; isRefreshSuccess = false;}
//       });
//     });

//     localStorage.setItem("jwt", refreshRes.token);
//     localStorage.setItem("refreshToken", refreshRes.refreshToken);
//     isRefreshSuccess = true;

//     return isRefreshSuccess;
//   }
// }

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, 
UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn.getValue() !== true) {
      // window.alert("Access not allowed!");
      this.authService.redirectToLogin();
      return true;
    }
    const userRoles = this.authService.getRoles();
      if (next.data.role && userRoles.indexOf(next.data.role) === -1) {
        this.router.navigate(['']);
        return false;
      }
      return true;
  }
}