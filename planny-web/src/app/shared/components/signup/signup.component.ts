import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { catchError, of, Subscription } from 'rxjs';
import { IApiResponse } from 'src/app/core/models/apiResponse.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { IExternalAuth } from '../../models/external-auth';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit ,OnDestroy{
  signupForm: FormGroup;
  subscription: Subscription;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private toastr: ToasterService
  ) {
    this.signupForm = this.fb.group({
      name: [''],
      email: [''],
      password: ['',[Validators.minLength(5)]],
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription=this.authService.extAuthChanged.subscribe((user) => {
      if (user != null) {
        const externalAuth: IExternalAuth = {
          provider: user.provider,
          idToken: user.idToken,
        };
        this.authService.externalLogin(externalAuth);
      }
    });
  }
  registerUser() {
    this.authService.signUp(this.signupForm.value)
  .subscribe({
    next: (res:IApiResponse<any>) => {
        if(res.statusCode == 200)
        {
        this.toastr.success('user registered successfully');
          this.signupForm.reset();
          this.router.navigate(['login']);
        }
        else this.toastr.error(res.message);
      },
   // error: (err:IApiResponse<any>) =>console.log(err.statusCode+', '+err.message)
 });
  }
}