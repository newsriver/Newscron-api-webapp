import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';

@Injectable()
export class IpApiClientService {

  private baseURL: string = "http://ip-api.com/json";

  constructor( @Inject(Http) private http: Http) {

  }



  public getLocation(): Observable<UserLocation> {

    return this.http.get(this.baseURL)
      .map(this.extractData);
    //.catch(this.handleError);


  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

}


export class UserLocation {
  public country: string = null;
  public countryCode: string = null;
  public region: string = null;
  public regionName: string = null;
  public city: string = null;
  public zip: number = null;
}
