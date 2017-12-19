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
  }

  removeCategory(categoryId: number) {
    this.preferences.categories = this.preferences.categories.filter(item => item.id != categoryId);
    this.client.resetUserPreferences(this.preferences, true);
  }


  public onPreferenceChange($event) {
    this.client.setUserPreferences(this.preferences);
  }



}
