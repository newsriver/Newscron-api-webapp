import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences} from '../newscron-client.service';


@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(items: any, args: any[]): any {
    return Object.keys(items);
  }
}

@Pipe({
  name: 'categoryAmmount'
})
export class CategoryAmmountPipe implements PipeTransform {
  transform(item: any, args: any[]): any {
    switch (item) {
      case 5:
        return "few";
      case 10:
        return "some";
      case 15:
        return "standard";
      case 20:
        return "many";
      case 25:
        return "extreme";
      default:
        return "none";
    }
  }
}

@Pipe({
  name: 'editionPerContinent'
})
export class EditionPerContinent implements PipeTransform {
  transform(items: Array<Package>, arg: string): Array<Package> {
    return items.filter(item => item.continent === arg);
  }
}


@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: []
})

export class WelcomeComponent implements OnInit {

  @Output() setWelcomeStep = new EventEmitter();
  public loading: boolean = false;
  public continent: string;
  public step: number = 0;
  public packagesIds: number[] = [];
  public categories: CategoryPreference[] = [];
  public continents: Continent[] = JSON.parse('[{"title":"Europe","id":"EUROPE","size":"13"}]');

  constructor(private client: NewscronClientService) {

  }

  ngOnInit() {
    this.step = 1;
    this.boot(null);
  }

  setContinent(name: string) {
    this.continent = name;
    this.step++;
    this.setWelcomeStep.emit(this.step);
  }

  close() {
    this.step = 0;
    this.setWelcomeStep.emit(this.step);
  }

  back() {
    this.step--;
    this.setWelcomeStep.emit(this.step);
  }

  next() {
    this.step++;
    this.setWelcomeStep.emit(this.step);
  }

  finish() {
    this.step = -1;
    var preferences: UserPreferences = new UserPreferences();
    preferences.categories = this.categories;
    this.client.resetUserPreferences(preferences, true);
    this.setWelcomeStep.emit(this.step);
  }

  public hasOnePackage() {
    return this.packagesIds.length > 0
  }



  private onPackageChange() {
    this.boot(this.packagesIds);
  }



  public selectCategory(e) {
    if (e.target.checked) {
      this.categories[e.target.value].amount = 5;
    } else {
      this.categories[e.target.value].amount = 0;
    }
  }


  private boot(packagesIds: number[]) {
    this.loading = true;
    this.client.boot(packagesIds).subscribe(bootConfig => {
      this.loading = false;
      if (bootConfig != null) {
        this.categories = bootConfig.categories;
      }
    });
  }

}

export class Package {
  public id: number;
  public name: string = null;
  public continent: string;
  public selected: boolean = false;
}

export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
