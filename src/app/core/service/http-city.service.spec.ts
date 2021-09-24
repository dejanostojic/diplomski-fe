import { TestBed } from '@angular/core/testing';

import { HttpCityService } from './http-city.service';

describe('HttpCityService', () => {
  let service: HttpCityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
