import { NgModule, OnInit, Component } from '@angular/core';
import {FeaturedComponent} from '../featured/featured.component';
import {WelcomeComponent} from '../welcome/welcome.component';
import {NewscronClientService, BootstrapConfiguration, Section, CategoryPreference, Article} from '../newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router } from '@angular/router';
import { CordovaService } from '../cordova.service';


@Pipe({
  name: 'validSection'
})
export class ValidSectionFilter implements PipeTransform {

  constructor(public client: NewscronClientService) {

  }

  transform(items: Array<Section>, args: any[]): Array<Section> {
    items = items.filter(item => item.articles.length > 0);
    items.sort((a: Section, b: Section) => {
      let cata = this.client.getUserPreferences().getCategory(a.category.id);
      let catb = this.client.getUserPreferences().getCategory(b.category.id);
      return (catb == null ? 0 : catb.amount) - (cata == null ? 0 : cata.amount);
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
  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  providers: []
})
export class MainContentComponent implements OnInit {

  public bootConfig: BootstrapConfiguration;
  public categories: CategoryPreference[] = [];
  public displayWelcome: boolean = false;

  constructor(private client: NewscronClientService, public router: Router, public cordovaService: CordovaService) {

  }

  ngOnInit() {



    if (this.client.getUserPreferences() == null) {

      if (this.cordovaService.onCordova) {
        this.router.navigate(['/welcome']);
      } else {
        this.displayWelcome = true;
      }

    }


    this.client.refreshListener().subscribe(refresh => {
      if (refresh) {
        if (this.client.getUserPreferences() == null) {
          this.displayWelcome = true;
        } else {
          this.categories = this.client.getUserPreferences().categories;
        }
      }
    });
  }


  public isSearch() {
    return this.router.url.startsWith('/search');
  }


  public searchPhrase: string;
  public search(e) {
    this.router.navigate(['/search', '', this.searchPhrase]);
  }


}
