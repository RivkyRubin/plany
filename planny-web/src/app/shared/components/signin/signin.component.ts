import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ForgotPasswordDialogComponent } from 'src/app/features/account/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { IExternalAuth } from '../../models/external-auth';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit ,OnDestroy{
  signinForm: FormGroup;
  subscription: Subscription;
  returnUrl:string;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.signinForm = this.fb.group({
      email: [''],
      password: ['',[Validators.required, Validators.minLength(5)]],
    });
  }
  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'events';
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
  
  loginUser() {
    this.authService.signIn(this.signinForm.value,this.returnUrl);
  }


  openForgotPasswordDialog() {
    var dialog = this.dialog.open(ForgotPasswordDialogComponent, {
      // data: eventGroup,
    });
  }
}
