import { Component, OnInit } from '@angular/core';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences } from '../../newscron-client.service';
import { Publisher } from '../../newscron-model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserProfileService } from '../../user-profile.service';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-category-config',
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.css']
})
export class CategoryConfigComponent implements OnInit {

  public category: CategoryPreference = null;
  public preferences: UserPreferences = null;
  public bannedPublishers: Publisher[] = [];
  private categoryId: number;
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, private userProfile: UserProfileService) {

  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params['id'];
    this.preferences = this.client.getUserPreferences();
    this.category = this.preferences.getCategory(this.categoryId);
    this.updateBannedPublishers(this.categoryId);
  }

  private updateBannedPublishers(categoryId: number) {
    this.bannedPublishers = [];
    let publishersRelevance: { [id: number]: Publisher; } = this.userProfile.getRemovedPublishersForCategory(categoryId);
    for (var key in publishersRelevance) {
      this.bannedPublishers.push(publishersRelevance[key]);
    }
  }

  public onPreferenceChange($event) {
    this.client.setUserPreferences(this.preferences);
  }

  public undoPublisherOptOut(publisher: Publisher) {
    this.userProfile.setPublishersRelevance(this.categoryId, publisher, 0);
    this.updateBannedPublishers(this.categoryId);
  }

}



export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
