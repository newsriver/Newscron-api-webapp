import { NgModule, OnInit, Component } from '@angular/core';
import {FeaturedComponent} from './featured/featured.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {NewscronClientService, BootstrapConfiguration, Section, Category, Article} from './newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';


@NgModule({
  declarations: []
})





@Pipe({
  name: 'validSection'
})
export class ValidSectionFilter implements PipeTransform {
  transform(items: Array<Section>, args: any[]): Array<Section> {
    items = items.filter(item => item.articles.length > 0);
    items = items.filter(item => item.category.amount > 0);
    items.sort((a: Section, b: Section) => {
      return b.category.amount - a.category.amount;
    });
    return items;
  }
}


@Pipe({
  name: "sortCategory",
  pure: false
})
export class SortCategory {
  transform(array: Array<Category>, args: string): Array<Category> {
    array = array.filter(item => item.amount > 0)
    array.sort((a: Category, b: Category) => {
      return b.amount - a.amount;
    });
    return array;
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
  public min: number = 1;
  public max: number = 10;

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

  public setUp() {
    this.welcomeStep = 1;
    window.scrollTo(0, 0);
  }


}
