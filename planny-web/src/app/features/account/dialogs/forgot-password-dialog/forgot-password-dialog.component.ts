import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {
  isDisabled:boolean= false;
  constructor(public authService: AuthService,
    private toastrService: ToasterService,
    private router: Router) { }
    forgetPasswordModel = {
      Email: ""
    }
  ngOnInit(): void {

  }
onSubmit(event: any, form: NgForm) {
    this.isDisabled = true;
    this.authService.sendPasswordResetLink(form.value.Email).subscribe({
      next:(res: boolean) => {
        if (res) {
          this.toastrService.success('The Password reset link has been successfully sent to your registered email');
          this.isDisabled = false;
          form.form.reset();
        }
        else {
                    this.isDisabled = false;
          form.form.reset();
        }
      },
      error:(err) => {
        this.toastrService.error('There is some problem while sending password reset link to your email, Please contact to administrator.');
        this.isDisabled = false;
        form.form.reset();
      }
})
  }

}