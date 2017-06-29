import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

@Injectable()
export class NewscronClientService {


  private baseURL: string = "http://app.newscron.com/v3";
  //private baseURL: string = "http://localhost:9092/v3";

  private userPreferences: UserPreferences = null;
  private refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private digests: Digest[] = [];

  //public categories: Observable<Array<Category>> = this._categories.asObservable();



  constructor( @Inject(Http) private http: Http) {
    let prefJson = JSON.parse(localStorage.getItem('userPreferences'));
    if (prefJson != null) {
      let preferences: UserPreferences = Object.assign(new UserPreferences(), prefJson);
      this.userPreferences = preferences;
    }

    if (this.userPreferences != null) {
      this.refresh.next(true);
    }

    this.digests = JSON.parse(localStorage.getItem('digests'));
    if (this.digests == null) {
      this.digests = [];
    }
  }

  public category(categoryId: number): Observable<Section> {
    var cat: CategoryPreference = null;
    for (let category of this.getUserPreferences().categories) {
      if (category.id == categoryId) {
        cat = category;
        break;
      }
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/category", cat, options)
      .map(this.extractData);

  }


  public search(search: string): Observable<Section> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.baseURL + "/search?search=" + search, options)
      .map(this.extractData)
      .catch(error => { return error; });

  }


  public featured(): Observable<Section[]> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/featured", this.getUserPreferences().categories, options)
      .map(this.extractData);

  }

  public digestsList(): Digest[] {
    return this.digests;
  }

  public assembleDigest(): Observable<Digest> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let timestamp: number = 0;

    if (this.digests.length > 0) {
      //this is a check to identify corrupted storage
      if (this.digests[0].timestamp == undefined) {
        this.digests = [];
        localStorage.setItem('digests', JSON.stringify(this.digests));
        timestamp = 0;
      } else {
        timestamp = this.digests[0].timestamp;
      }

    }


    return this.http.post(this.baseURL + "/digest?after=" + timestamp, this.getUserPreferences().categories, options)
      .map(this.extractData).map(digest => {
        if (digest != null) {
          this.digests.unshift(digest);
          localStorage.setItem('digests', JSON.stringify(this.digests));
          return digest;
        } else {
          return null;
        }
      })
      .catch(error => { return error; });

  }

  public boot(packagesIds: number[]): Observable<BootstrapConfiguration> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/boot", packagesIds, options)
      .map(this.extractData).map(bootConfig => {
        var preferences: UserPreferences = new UserPreferences();
        preferences.categories = bootConfig.categories;
        this.resetUserPreferences(preferences, false);
        return bootConfig;
      });
  }





  public resetUserPreferences(userPreferences: UserPreferences, save: boolean) {
    this.userPreferences = userPreferences;
    if (save) {
      localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    }
    //re-setting the  categoris will also delete all current digests
    this.digests = [];
    localStorage.setItem('digests', JSON.stringify(this.digests));
    this.refresh.next(true);
  }

  public publishersOptOut(publisher: Publisher, categoryOptOut: Category) {
    for (let category of this.getUserPreferences().categories) {
      if (category.id == categoryOptOut.id) {
        category.publishersOptOut.push(publisher);
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
        break;
      }
    }
  }

  public getUserPreferences(): UserPreferences {
    return this.userPreferences;
  }

  public hasPreferences(): Boolean {
    return localStorage.getItem('userPreferences') != null;
  }

  public setUserPreferences(preferences: UserPreferences) {
    this.userPreferences = preferences;
    localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
  }

  public refreshListener(): BehaviorSubject<boolean> {
    return this.refresh;
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
  public categories: CategoryPreference[];
  public packagesIds: number[] = [];
  public localPackagesIds: number[];
  public countryId: number;
}

export class UserPreferences {
  public categories: CategoryPreference[] = null;


  public getCategory(id: number): CategoryPreference {
    for (let category of this.categories) {
      if (category.id == id) {
        return category;
      }
    }
    return null;
  }
}

export class Publisher {

  public name: string;
  public id: number;
}
export class Category {
  public name: string = null;
  public id: number;
}

export class CategoryPreference extends Category {
  public amount: number;
  public packages: number[];
  public publishersOptOut: Publisher[] = [];
}

export class Section {
  public category: Category = null;
  public articles: Article[];
}

export class Digest {
  public timestamp: number = null;
  public sections: Section[];
}


export class Article {
  public id: number = null;
  public title: string = null;
  public url: string = null;
  public snippet: string = null;
  public imgUrl: string = null;
  public publicationDate: number = null;
  public publisher: Publisher = null;
  public category: string = null;
  public score: number = null;
}
