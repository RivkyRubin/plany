import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SplashScreenStateService } from 'src/app/core/services/splash-screen-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  splashScreeWasShown =false;
  constructor( private splashScreenStateService: SplashScreenStateService) {
   }

  ngOnInit(): void {
    this.splashScreenStateService.subscribe(res => {
      if(res == true)
      this.splashScreeWasShown=true;
   });
  }
  onAppear()
  {
    alert("appeared");
  }
}
