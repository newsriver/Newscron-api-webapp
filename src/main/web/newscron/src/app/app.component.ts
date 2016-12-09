import { NgModule, OnInit, Component } from '@angular/core';
import {FeaturedComponent} from './featured/featured.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {NewscronClientService, BootstrapConfiguration, Section, Category, Article} from './newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';


@NgModule({
    declarations: [FeaturedComponent, WelcomeComponent]
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
    providers: []
})
export class AppComponent implements OnInit {

    public bootConfig: BootstrapConfiguration;
    public categories: Category[] = [];
    public welcome: boolean = false;

    constructor(private client: NewscronClientService) {

    }

    ngOnInit() {
        this.client.getCategories().subscribe(categories => {
            if (categories == null) {
                this.welcome = true;
            } else {
                this.categories = categories
            }
        });
    }


    public closeWelcome(event) {
        this.welcome = false;
    }


}
