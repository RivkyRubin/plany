import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/core/models/apiResponse.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {
  userId: string = "";
  code: string = "";
  encodedCode: string = ""; 
  loading: boolean = true;
  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private toastrService: ToasterService,
) { }

  ngOnInit() {
  
    //Get the query string parameter from url
    this.activeRout.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.code = params['code'];
      this.onSubmit();
    });
    //Encoded the code to send appropriately for verfication
    this.encodedCode = encodeURIComponent(this.code);
  }

  onSubmit() {
  
    this.authService.confirmAccount({Code: this.code,UserID:this.userId}).subscribe({
      next:(res: ApiResponse<boolean>) => {
        this.loading = false;
        if (res.statusCode == 200) {
          this.toastrService.success("your account was confirmed");
          this.router.navigate(['login']);
        }
        else {
          this.toastrService.error(res.message);
        }
      },
      error:(error) => {
        this.loading = false;
        this.toastrService.error('error confirming your account');
      }
    }
    )
  }

}