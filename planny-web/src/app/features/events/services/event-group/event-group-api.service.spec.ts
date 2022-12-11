import { TestBed } from '@angular/core/testing';

import { EventGroupApiService } from './event-group-api.service';

describe('EventGroupApiService', () => {
  let service: EventGroupApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventGroupApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
