import { NgModule, OnInit, Component } from '@angular/core';
import {FeaturedComponent} from './featured/featured.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {NewscronClientService, BootstrapConfiguration, Section, CategoryPreference, Article} from './newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'validSection'
})
export class ValidSectionFilter implements PipeTransform {

  constructor(public client: NewscronClientService) {

  }

  transform(items: Array<Section>, args: any[]): Array<Section> {
    items = items.filter(item => item.articles.length > 0);
    items.sort((a: Section, b: Section) => {
      return this.client.getUserPreferences().getCategory(b.category.id).amount - this.client.getUserPreferences().getCategory(a.category.id).amount;
    });
    return items;
  }
}


@Pipe({
  name: "sortCategory",
  pure: false
})
export class SortCategory {
  transform(array: Array<CategoryPreference>, args: string): Array<CategoryPreference> {
    array = array.filter(item => item.amount > 0)
    array.sort((a: CategoryPreference, b: CategoryPreference) => {
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
  public categories: CategoryPreference[] = [];
  public welcomeStep: number = 0;

  constructor(private client: NewscronClientService) {

  }

  ngOnInit() {
    if (this.client.getUserPreferences() == null) {
      this.welcomeStep = 1;
    }


    this.client.refreshListener().subscribe(refresh => {
      if (refresh) {
        if (this.client.getUserPreferences() == null) {
          this.welcomeStep = 1;
        } else {
          this.categories = this.client.getUserPreferences().categories;
        }
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
