import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  snackBar:MatSnackBar;
  constructor(inj: Injector) {
    this.snackBar = inj.get(MatSnackBar);
   }
  error(message: string,duration?:number,action?:string,actionClicked?:Function)
  {
    this.toast(message,duration,'error',action,actionClicked);
  }
  success(message: string,duration?:number,action?:string,actionClicked?:Function)
  {
    this.toast(message,duration,'success',action,actionClicked);
  }
  warn(message: string,duration?:number,action?:string,actionClicked?:Function)
  {
    this.toast(message,duration,'warning',action,actionClicked);
  }
  toast(message:string,duration:number = 2000,toastLevel:string,action:string | undefined=undefined,actionClicked?:Function)
  {
    var ref = this.snackBar.open(message,action, {
      duration: duration,
      panelClass: [toastLevel]
    });
    ref.onAction().subscribe(() => {
      if(actionClicked!=undefined)
      actionClicked();
    });
    
  }
}
