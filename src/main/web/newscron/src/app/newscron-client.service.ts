import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';


@Injectable()
export class NewscronClientService {


    private baseURL: string = "http://localhost:9092/v3";

    constructor( @Inject(Http) private http: Http) {

    }



    public featured(configuration: Configuration): Observable<Section[]> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseURL + "/featured", configuration, options)
            .map(this.extractData);
        //.catch(this.handleError);


    }

    public boot(): Observable<Configuration> {

        return this.http.get(this.baseURL + "/boot")
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

export class Configuration {
    public categories: Category[];
    public pacakges: Package[];
    public countryId: number;
}

export class Package {
    public id: number;
    public name: string = null;
    public language: number;
    public rootPackage: number;
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
