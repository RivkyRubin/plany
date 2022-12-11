import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from 'src/app/core/services/splash-screen-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor( private splashScreenStateService: SplashScreenStateService) { }

  ngOnInit(): void {
  //   setTimeout(() => {
  //     this.splashScreenStateService.stop();
  //  }, 4000);
  }
  onAppear()
  {
    alert("appeared");
  }
}
