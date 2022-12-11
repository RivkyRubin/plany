import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLinesComponent } from './event-lines.component';

describe('EventLinesComponent', () => {
  let component: EventLinesComponent;
  let fixture: ComponentFixture<EventLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
