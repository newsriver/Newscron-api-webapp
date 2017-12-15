import { Component, OnInit } from '@angular/core';
import { NewscronClientService, UserPreferences, CategoryPreference } from '../../newscron-client.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.css']
})
export class GlobalConfigComponent implements OnInit {


  public preferences: UserPreferences = new UserPreferences();
  constructor(private client: NewscronClientService) { }

  ngOnInit() {
    this.preferences = this.client.getUserPreferences();
  }

  removeCategory(categoryId: number) {
    this.preferences.categories = this.preferences.categories.filter(item => item.id != categoryId);
    this.client.resetUserPreferences(this.preferences, true);
  }




}
