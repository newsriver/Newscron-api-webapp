/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IpApiClientService } from './ip-api-client.service';

describe('Service: IpApiClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpApiClientService]
    });
  });

  it('should ...', inject([IpApiClientService], (service: IpApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
