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
    public welcomeStep: number = 0;

    constructor(private client: NewscronClientService) {

    }

    ngOnInit() {
        this.client.getCategories().subscribe(categories => {
            if (categories == null) {
                this.welcomeStep = 1;
            } else {
                this.categories = categories
            }
        });
    }


    public setWelcomeStep(step: number) {
        this.welcomeStep = step;
    }


}
