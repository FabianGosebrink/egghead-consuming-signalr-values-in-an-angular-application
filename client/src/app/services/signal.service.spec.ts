import { TestBed, inject } from '@angular/core/testing';

import { SignalService } from './signal.service';

describe('SignalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalService]
    });
  });

  it('should be created', inject([SignalService], (service: SignalService) => {
    expect(service).toBeTruthy();
  }));
});
