import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFriendsDialogComponent } from './event-friends-dialog.component';

describe('EventFriendsDialogComponent', () => {
  let component: EventFriendsDialogComponent;
  let fixture: ComponentFixture<EventFriendsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventFriendsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFriendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
