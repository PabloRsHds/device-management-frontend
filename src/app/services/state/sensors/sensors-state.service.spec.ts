import { TestBed } from '@angular/core/testing';

import { SensorsStateService } from './sensors-state.service';

describe('SensorsStateService', () => {
  let service: SensorsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
