import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import Validation from 'src/app/shared/utils/validation';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastrService: ToasterService,
    private formBuilder: FormBuilder) { }

  userId: string = "";
  code: string = "";
  encodedCode: string = "";

  // resetPasswordModel = this.formBuilder.group({
  //   Passwords: this.formBuilder.group({
  //     Password: ['', [Validators.required, Validators.minLength(4)]],
  //     ConfirmPassword: ['', Validators.required]
  //   },
  //   // { validator: this.authService.comparePasswords }
  //   )
  // });
  resetPasswordModel = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required] 
  }, { validators: [Validation.match('password', 'confirmPassword')] }
  );

  
  ngOnInit() {
    this.resetPasswordModel.reset();
    //Get the query string parameter from url
    this.activeRout.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.code = params['code'];
    });
    //Encoded the code to send appropriately for verfication
    this.encodedCode = encodeURIComponent(this.code);
  }

  onSubmit() {
    this.resetPasswordModel.disable();
    this.authService.resetUserPassword({Code: this.code,UserID:this.userId,Password:this.resetPasswordModel.value.password!}).subscribe({
      next:(res: boolean) => {
        if (res == true) {
          this.resetPasswordModel.reset();
          this.resetPasswordModel.enable();
          this.router.navigate(['login']);
        }
        else {
          this.resetPasswordModel.reset();
          this.resetPasswordModel.enable();
        }
      },
      error:(error) => {
                this.resetPasswordModel.reset();
        this.resetPasswordModel.enable();
      }
    }
    )
  }

}