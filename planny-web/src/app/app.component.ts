import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './core/services/auth.service';
import { SplashScreenStateService } from './core/services/splash-screen-state.service';
import { MessageDialogComponent } from './features/events/dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'planny-web';
  constructor(
    public authService: AuthService,
    private splashScreenStateService: SplashScreenStateService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    if (this.authService.hasToken()) this.authService.isLoggedIn.next(true);
    setTimeout(() => {
      this.splashScreenStateService.stop();
    }, 1000);

    if (localStorage['Confirm'] == null || localStorage['Confirm'] != 'true')
      setTimeout(() => {
        const ref = this.dialog.open(MessageDialogComponent,{
          width: '600px',
          data: `  The website is in building. <br/>
          the data might be deleted.`,
        });
        ref.afterClosed().subscribe((result) => {
          if (result != undefined) localStorage['Confirm'] = true;
        });
      }, 5000);
  }
}
