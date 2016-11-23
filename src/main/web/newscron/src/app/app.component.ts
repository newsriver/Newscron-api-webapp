import { NgModule, Component } from '@angular/core';
import {CategoryComponent} from './category/category.component';
import {IpApiClientService, UserLocation} from './ip-api-client.service';
import {NewscronClientService, Section, Category, Article} from './newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';


@NgModule({
    declarations: [CategoryComponent]
})



@Pipe({
    name: 'validSection'
})
export class ValidSectionFilter implements PipeTransform {
    transform(items: any[], args: any[]): any {
        return items.filter(item => item.articles.length > 0);
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [NewscronClientService, IpApiClientService]
})
export class AppComponent {

    public sections: Section[] = [];
    public categories: Category[] = [];
    public location: UserLocation = null;

    constructor(private client: NewscronClientService, private ipClient: IpApiClientService) {


        this.client.boot().subscribe(configuration => {
            this.categories = configuration.categories;

            this.client.featured(configuration).subscribe(sections => {
                this.sections = sections;
            });
        });

    }


}
