import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Inject} from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

@Injectable()
export class NewscronClientService {


    private baseURL: string = "http://app.newscron.newsriver.io/v3";

    private categories: Subject<Array<Category>> = new BehaviorSubject<Array<Category>>(null);
    private bootConfig: Subject<BootstrapConfiguration> = new BehaviorSubject<BootstrapConfiguration>(null);


    //public categories: Observable<Array<Category>> = this._categories.asObservable();



    constructor( @Inject(Http) private http: Http) {
        let cat: Array<Category> = JSON.parse(localStorage.getItem('categories'));
        if (cat != null) {
            this.categories.next(cat);
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




    public getCategories(): Observable<Array<Category>> {
        return this.categories;
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }



}

export class BootstrapConfiguration {
    public categories: Category[];
    public packagesIds: number[];
    public localPackagesIds: number[];
    public countryId: number;
}


export class Category {
    public name: string = null;
    public id: number;
    public defaultAmount: number;
    public packages: number[];
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
