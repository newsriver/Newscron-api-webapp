import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';


@Injectable()
export class NewscronClientService {


  private baseURL: string = "http://localhost:9092/v3";

  constructor( @Inject(Http) private http: Http) {

  }



  public featured(categories: Category[]): Observable<Section[]> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/featured", categories, options)
      .map(this.extractData);
    //.catch(this.handleError);


  }


  public getCategories(): Observable<Category[]> {

    return this.http.get(this.baseURL + "/categories")
      .map(this.extractData);
    //.catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

}


export class Category {
  public name: string = null;
  public id: number;
  public defaultAmount: number;
}


export class Section {
  public category: Category = null;
  public articles: Article[];
}


export class Article {
  public title: string = null;
  public url: string = null;
  public snippet: string = null;
  public imgUrl: string = null;
  public publicationDate: string = null;
  public publisher: string = null;

}
