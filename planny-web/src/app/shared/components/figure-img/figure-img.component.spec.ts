import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigureImgComponent } from './figure-img.component';

describe('FigureImgComponent', () => {
  let component: FigureImgComponent;
  let fixture: ComponentFixture<FigureImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigureImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FigureImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
