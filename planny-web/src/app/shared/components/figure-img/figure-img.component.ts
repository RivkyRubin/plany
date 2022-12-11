import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-figure-img',
  templateUrl: './figure-img.component.html',
  styleUrls: ['./figure-img.component.scss']
})
export class FigureImgComponent implements OnInit {
@Input() src:any='';
@Input() alt:any='';
  constructor() { }

  ngOnInit(): void {
  }

}
