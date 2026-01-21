import { TestBed } from '@angular/core/testing';

import { DevicesStateService } from './devices-state.service';

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
