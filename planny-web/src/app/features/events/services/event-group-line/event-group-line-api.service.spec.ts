import { TestBed } from '@angular/core/testing';

import { EventGroupLineApiService } from './event-group-line-api.service';

describe('EventGroupLineApiService', () => {
  let service: EventGroupLineApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventGroupLineApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
