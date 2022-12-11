import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { trigger, style, animate, transition, state } from '@angular/animations';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(-100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateY(-100%)', opacity: 0}))
        ]),
        state('shown', style({
          transform: 'translateY(0%)'})
        ), state('hidden', style({
          transform: 'translateY(100%)', opacity: 0})
        ), transition('hidden => shown', [
          animate('3s')
        ]),
      ]
    )
  ],
})
export class NavbarComponent implements OnInit {
  showSplash = true;
  faBars = faBars;
  isCollapsed = false;
  activeId:any;
  state = 'hidden';
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    setTimeout(() => {
      //this.showSplash = false;
   }, 1000);
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.state = 'shown';
    }, 200);
  }

  logout(){
    this.authService.doLogout();
  }
  

}
