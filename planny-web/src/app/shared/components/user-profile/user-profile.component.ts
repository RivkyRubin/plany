import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUser, User } from '../../models/user.model';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  currentUser: User = new User();
  constructor(
    public authService: AuthService,
    private actRoute: ActivatedRoute
  ) {
    this.authService.getUserProfile().subscribe((res) => {
      this.currentUser = res;
    });
  }
  ngOnInit() {}
}