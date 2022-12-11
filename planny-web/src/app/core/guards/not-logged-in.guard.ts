import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class NotLoggedInGuard implements CanActivate {
    constructor(
      public authService: AuthService,
      public router: Router
    ) { }
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.isLoggedIn.getValue() == true) {
        // window.alert("Access not allowed!");
         this.router.navigate([''])
        return true;
      }
      return true;
    }
  }