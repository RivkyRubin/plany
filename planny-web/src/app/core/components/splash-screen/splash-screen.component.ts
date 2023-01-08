import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from '../../services/splash-screen-state.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
showFollPageMode = true;
public showSplash = true;
readonly ANIMATION_DURATION = 1;
  constructor( private splashScreenStateService: SplashScreenStateService) { }

  ngOnInit(): void {
     // Somewhere the stop method has been invoked
   this.splashScreenStateService.subscribe(res => {
    if(res == false)
    this.hideSplashAnimation();
 });
  }
  private closeSplashScreen()
  {
     this.showFollPageMode = false;
      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, 1000);
  }

  private hideSplashAnimation() {
     this.closeSplashScreen();
 }
}
