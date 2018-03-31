import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CordovaService } from './cordova.service';
import { UserProfileService } from './user-profile.service';
import { Digest, Section, Category, Article, Publisher, Log } from './newscron-model';
import { environment } from '../environments/environment';

@Injectable()
export class NewscronClientService {

  private baseURL: string = environment.serviceURL + "/v3";

  private userPreferences: UserPreferences = null;
  private refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private digests: Digest[] = [];
  private latestDigestUnvalid = false;
  //public categories: Observable<Array<Category>> = this._categories.asObservable();



  constructor( @Inject(Http) private http: Http, private cordova: CordovaService, private userProfile: UserProfileService, private httpClient: HttpClient) {
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

    //consider to move this in the client and use refreshListener instead
    if (this.cordova.onCordova) {
      this.cordova.resumeListener().subscribe(item => {
        if (item != null) {
          this.refresh.next(true);
        }
      });
    }
  }



  public category(categoryId: number, before?: number): Observable<Section> {
    var cat: CategoryPreference = null;
    for (let category of this.getUserPreferences().categories) {
      if (category.id == categoryId) {
        cat = category;
        cat.publishersRelevance = this.userProfile.getRemovedPublishersForCategory(category.id);
        break;
      }
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let url = this.baseURL + "/category";
    if (before != null) {
      url += "?before=" + before;
    }

    return this.http.post(url, cat, options)
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

  public unvalidateLatestDigest() {
    this.latestDigestUnvalid = true;
    this.refresh.next(true);
  }

  public digestsList(): Digest[] {
    return this.digests;
  }

  public assembleDigest(): Observable<Digest> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let timestamp: number = 0;

    if (this.latestDigestUnvalid && this.digests.length > 0) {
      this.digests.splice(0, 1);
      this.latestDigestUnvalid = false;
    }

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

    let categoriesPreferences: CategoryPreference[] = this.getUserPreferences().categories;
    if (categoriesPreferences != null) {
      for (let category of categoriesPreferences) {
        category.publishersRelevance = this.userProfile.getRemovedPublishersForCategory(category.id);
      }
    }
    console.log("[Newscron] preparing digest request...");
    return this.httpClient.post<any>(this.baseURL + "/digest?after=" + timestamp, categoriesPreferences, { headers: new HttpHeaders().set('Content-Type', 'application/json') }).map(digest => {
      console.log("[Newscron] digest received.");
      if (digest != null) {
        this.digests.unshift(digest);
        //keep a maximum of 10 digests
        this.digests = this.digests.slice(0, 10);
        localStorage.setItem('digests', JSON.stringify(this.digests));
        return digest;
      } else {
        return null;
      }
    },
      (err: HttpErrorResponse) => {
        console.log("[Newscron] error receiving digest.");
        return err;
      }
    );


    /*return this.http.post(this.baseURL + "/digest?after=" + timestamp, categoriesPreferences, options)
      .map(this.extractData).map(digest => {
        if (digest != null) {
          this.digests.unshift(digest);
          //keep a maximum of 10 digests
          this.digests = this.digests.slice(0, 10);
          localStorage.setItem('digests', JSON.stringify(this.digests));
          return digest;
        } else {
          return null;
        }
      });*/
  }

  public boot(packagesIds: number[]): Observable<BootstrapConfiguration> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/boot", packagesIds, options)
      .map(this.extractData).map(bootConfig => {
        var preferences: UserPreferences = new UserPreferences();
        preferences.categories = bootConfig.categories;
        preferences.searchLanguage = bootConfig.searchLanguage;
        this.resetUserPreferences(preferences, false);
        return bootConfig;
      });
  }






  public resetUserPreferences(userPreferences: UserPreferences, save: boolean) {
    this.userPreferences = userPreferences;
    if (save) {
      localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
      //re-setting the  categoris will also delete all current digests
      this.digests = [];
      localStorage.setItem('digests', JSON.stringify(this.digests));
    }
    this.unvalidateLatestDigest();
    this.refresh.next(true);
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
    this.unvalidateLatestDigest();
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
  public searchLanguage: string;
}

export class UserPreferences {
  public categories: CategoryPreference[] = null;
  public searchLanguage: string = null;

  public getCategory(id: number): CategoryPreference {
    for (let category of this.categories) {
      if (category.id == id) {
        return category;
      }
    }
    return null;
  }
}



export class CategoryPreference extends Category {
  public amount: number;
  public packages: number[];
  public entitledPackages: number[];
  public publishersRelevance: { [id: number]: Publisher; } = {};
}
