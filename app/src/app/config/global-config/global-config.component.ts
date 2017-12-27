import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NewscronClientService, UserPreferences, CategoryPreference } from '../../newscron-client.service';
import { Publisher } from '../../newscron-model';
import { UserProfileService } from '../../user-profile.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { GENERIC_CATEGORIES, LOCAL_CATEGORIES } from '../categories';
import { PACKAGES } from '../packages';

@Pipe({ name: 'values', pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}

@Pipe({ name: 'entitledPackages', pure: false })
export class EntitledPackages implements PipeTransform {
  transform(value: any, arg: CategoryPreference = null): any {
    if (LOCAL_CATEGORIES[arg.id] == null || LOCAL_CATEGORIES[arg.id].entitledPackages == null) {
      return value;
    } else {
      return value.filter(item => LOCAL_CATEGORIES[arg.id].entitledPackages.indexOf(item.id) != -1);
    }
  }
}


@Component({
  selector: 'app-global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.css']
})
export class GlobalConfigComponent implements OnInit {


  public preferences: UserPreferences = new UserPreferences();
  public newCategory: CategoryPreference = null;
  public categories = null;
  public localCategories = null;
  public packages = PACKAGES;
  public packagesList = null;

  constructor(private client: NewscronClientService, public userProfile: UserProfileService) {
    this.packagesList = Object.keys(PACKAGES).map(key => PACKAGES[key]).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }



  ngOnInit() {
    this.preferences = this.client.getUserPreferences();
    this.updateAvailableCategories();
  }

  private updateAvailableCategories() {

    this.categories = GENERIC_CATEGORIES
      .filter(item => {
        return this.preferences.categories.filter(pref => pref.id == item.id).length == 0;
      })
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    this.localCategories = Object.keys(LOCAL_CATEGORIES).map(key => LOCAL_CATEGORIES[key])
      .filter(item => {
        return this.preferences.categories.filter(pref => pref.id == item.id).length == 0;
      })
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  }

  removeCategory(categoryId: number) {
    this.preferences.categories = this.preferences.categories.filter(item => item.id != categoryId);
    this.client.resetUserPreferences(this.preferences, true);
    this.updateAvailableCategories();
  }

  addCategory() {

    let category = { "name": null, "id": null, "amount": null, "packages": [], "publishersRelevance": {}, "entitledPackages": [] };
    category.id = this.newCategory.id;
    category.name = this.newCategory.name;
    category.amount = this.newCategory.amount;
    if (this.newCategory.entitledPackages != null) {
      category.packages = this.newCategory.entitledPackages;
    } else {
      //TODO: This code really sucks, its a quick hack to get the most used package and set it as default for the newly added category.
      //Instead we should either ask the user or find a method to store the main packages e.g. the ones selected when setting up the app.
      let selectedPackages = {};
      this.preferences.categories.reduce((packages, item) => {
        item.packages.forEach(function(element) {
          if (selectedPackages[element] == null) {
            selectedPackages[element] = 1;
          } else {
            selectedPackages[element]++;
          }
        });
        return packages;
      });
      let items = Object.keys(selectedPackages).map(function(key) {
        return [key, selectedPackages[key]];
      });
      items.sort(function(first, second) {
        return second[1] - first[1];
      });
      category.packages.push(items.slice(0, 1)[0][0]);
    }
    this.preferences.categories.unshift(category);
    this.client.resetUserPreferences(this.preferences, true);
    this.newCategory = null;
    this.updateAvailableCategories();
  }


  public onPreferenceChange($event) {
    this.client.setUserPreferences(this.preferences);
    this.updateAvailableCategories();
  }



  public addSource(change: MatSelectChange, category: CategoryPreference) {
    category.packages.push(change.value.id);
    this.client.setUserPreferences(this.preferences);
    console.log(change)
  }
  public removeSource(packagesId: number, category: CategoryPreference) {
    let index: number = category.packages.indexOf(packagesId);
    if (index >= 0) {
      category.packages.splice(index, 1);
    }
    this.client.setUserPreferences(this.preferences);
  }

  public restorePublisher(publisher: Publisher, category: CategoryPreference) {
    this.userProfile.setPublishersRelevance(category.id, publisher, 0);
  }

  public hasRemovedPublishers(categoryId: number) {
    return Object.keys(this.userProfile.getRemovedPublishersForCategory(categoryId)).length > 0
  }
}
