import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { SplashScreenStateService } from './core/services/splash-screen-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'planny-web';
  constructor(public authService: AuthService,private splashScreenStateService:SplashScreenStateService) { }
  ngOnInit(): void {
    if(this.authService.hasToken() )
    this.authService.isLoggedIn.next(true);
    setTimeout(() => {
      this.splashScreenStateService.stop();
   }, 1000);
  }

}
