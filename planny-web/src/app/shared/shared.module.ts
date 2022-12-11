import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountDownComponent } from './components/count-down/count-down.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FigureImgComponent } from './components/figure-img/figure-img.component';



@NgModule({
  declarations: [
    CountDownComponent,
    FigureImgComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports:[
    CountDownComponent,
    FigureImgComponent
  ]
})
export class SharedModule { }
