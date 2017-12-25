import { Component, OnInit } from '@angular/core';
import { NewscronClientService, UserPreferences, CategoryPreference } from '../../newscron-client.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import {FormControl,ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { GENERIC_CATEGORIES,LOCAL_CATEGORIES } from '../categories';
@Component({
  selector: 'app-global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.css']
})
export class GlobalConfigComponent implements OnInit {


  public preferences: UserPreferences = new UserPreferences();
  constructor(private client: NewscronClientService) { }
  public newCategory : number = null;
  public categories = GENERIC_CATEGORIES;
  public localCategories = LOCAL_CATEGORIES;

  ngOnInit() {
    this.preferences = this.client.getUserPreferences();
    this.updateAvailableCategories();
  }

  removeCategory(categoryId: number) {
    this.preferences.categories = this.preferences.categories.filter(item => item.id != categoryId);
    this.client.resetUserPreferences(this.preferences, true);
    this.updateAvailableCategories();
  }

  addCategory() {

    let category = {"name":null,"id":null,"amount":null,"packages":[],"publishersRelevance":{}};
    category.id = this.newCategory.id;
    category.name = this.newCategory.name;
    category.amount = this.newCategory.amount;
    if(this.newCategory.entitledPackages!=null){
      category.packages = this.newCategory.entitledPackages;
    }else{
      let selectedPackages = {};
      this.preferences.categories.reduce((packages, item) => {
        item.packages.forEach(function(element) {
            if(selectedPackages[element]==null){
              selectedPackages[element]=1;
            }else{
              selectedPackages[element]++;
            }
          });
      },selectedPackages);

      let items = Object.keys(selectedPackages).map(function(key) {
            return [key, selectedPackages[key]];
      });
      items.sort(function(first, second) {
          return second[1] - first[1];
        });
        console.log(items.slice(0, 1)[0]);
      category.packages.push(items.slice(0, 1)[0][0]);
    }
    this.preferences.categories.push(category);
    this.client.resetUserPreferences(this.preferences, true);
    this.newCategory=null;
    this.updateAvailableCategories();
  }


  public onPreferenceChange($event) {
    this.client.setUserPreferences(this.preferences);
    this.updateAvailableCategories();
  }

  private updateAvailableCategories(){
    this.categories = GENERIC_CATEGORIES.filter(item => {
      return this.preferences.categories.filter(pref => pref.id == item.id).length == 0;
    });
    this.localCategories = LOCAL_CATEGORIES.filter(item => {
      return this.preferences.categories.filter(pref => pref.id == item.id).length == 0;
    });
  }

}
