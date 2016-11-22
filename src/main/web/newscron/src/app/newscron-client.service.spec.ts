/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewscronClientService } from './newscron-client.service';

describe('Service: NewscronClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewscronClientService]
    });
  });

  it('should ...', inject([NewscronClientService], (service: NewscronClientService) => {
    expect(service).toBeTruthy();
  }));
});
