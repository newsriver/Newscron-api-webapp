import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

@Injectable()
export class NewscronClientService {


  private baseURL: string = "http://app.newscron.com/v3";
  //private baseURL: string = "http://localhost:9092/v3";

  private categories: BehaviorSubject<Array<Category>> = new BehaviorSubject<Array<Category>>(null);
  private bootConfig: Subject<BootstrapConfiguration> = new BehaviorSubject<BootstrapConfiguration>(null);
  private digests: Digest[] = [];

  //public categories: Observable<Array<Category>> = this._categories.asObservable();



  constructor( @Inject(Http) private http: Http) {
    let cat: Array<Category> = JSON.parse(localStorage.getItem('categories'));
    if (cat != null) {
      this.categories.next(cat);
    }

    this.digests = JSON.parse(localStorage.getItem('stream'));
    if (this.digests == null) {
      this.digests = [];
    }
  }

  public category(cat: Category): Observable<Section> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/category", cat, options)
      .map(this.extractData);

  }


  public featured(cat: Array<Category>): Observable<Section[]> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/featured", cat, options)
      .map(this.extractData);

  }

  public digestsList(): Digest[] {
    return this.digests;
  }

  public loadDigest(cat: Array<Category>): Observable<boolean> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let timestamp: number = 0;

    if (this.digests.length > 0) {
      //this is a check to identify corrupted storage
      if (this.digests[0].latestId == undefined) {
        this.digests = [];
        localStorage.setItem('stream', JSON.stringify(this.digests));
        timestamp = 0;
      } else {
        timestamp = this.digests[0].timestamp;
      }

    }

    return this.http.post(this.baseURL + "/digest?from=" + timestamp, cat, options)
      .map(this.extractData).map(chunk => {
        if (chunk != null) {
          this.digests.unshift(chunk);
          localStorage.setItem('stream', JSON.stringify(this.digests));
          return true;
        } else {
          return false;
        }
      })
      .catch(error => { alert('nocontent'); return error; });

  }

  public boot(packagesIds: number[]): Observable<BootstrapConfiguration> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.baseURL + "/boot", packagesIds, options)
      .map(this.extractData).subscribe(bootConfig => {
        this.categories.next(bootConfig.categories);
        this.bootConfig.next(bootConfig);
      });


    return this.bootConfig;
  }





  public setCategories(categories: Category[]) {
    this.categories.next(categories);
    localStorage.setItem('categories', JSON.stringify(categories));
  }




  public getCategories(): BehaviorSubject<Array<Category>> {
    return this.categories;
  }


  private extractData(res: Response) {
    if (res.status != 200) {
      return null;
    }
    let body = res.json();
    return body || {};
  }




}

export class BootstrapConfiguration {
  public categories: Category[];
  public packagesIds: number[] = [];
  public localPackagesIds: number[];
  public countryId: number;
}


export class Category {
  public name: string = null;
  public id: number;
  public amount: number;
  public packages: number[];
}

export class Section {
  public category: Category = null;
  public articles: Article[];
}

export class Digest {
  public timestamp: number = null;
  public latestId: number = null;
  public articles: Article[];
}


export class Article {
  public id: number = null;
  public title: string = null;
  public url: string = null;
  public snippet: string = null;
  public imgUrl: string = null;
  public publicationDate: number = null;
  public publisher: string = null;
  public category: string = null;
  public score: number = null;
}
