import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGroupLineEditDialog } from './event-group-line-edit-dialog.component';

describe('EventGroupLineEditDialogComponent', () => {
  let component: EventGroupLineEditDialog;
  let fixture: ComponentFixture<EventGroupLineEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventGroupLineEditDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventGroupLineEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
