import { TestBed } from '@angular/core/testing';

import { ClimberService } from './climber.service';

describe('ClimberService', () => {
  let service: ClimberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
