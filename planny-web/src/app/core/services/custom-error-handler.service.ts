import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ToasterService } from './toaster/toaster.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler{

  constructor(private toaster:ToasterService,private zone: NgZone) { }
  handleError(error: unknown): void {


    this.zone.run(()=>{ 
       
      if (error instanceof HttpErrorResponse) {  
        if(error.status==401)
        return;
        this.toaster.error(error.message);
      }
      else 
      {
      this.toaster.error('error accured'); 
      }
       console.warn(error);
    })
    
  
  }
}
