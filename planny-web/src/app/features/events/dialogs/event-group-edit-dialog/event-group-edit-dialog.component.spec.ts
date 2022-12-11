import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGroupEditDialog } from './event-group-edit-dialog.component';

describe('EventGroupEditDialog', () => {
  let component: EventGroupEditDialog;
  let fixture: ComponentFixture<EventGroupEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventGroupEditDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventGroupEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
