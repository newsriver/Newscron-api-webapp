import { Component, OnInit } from '@angular/core';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences } from '../../newscron-client.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserProfileService, PublisherRelevance } from '../../user-profile.service';

@Component({
  selector: 'app-category-config',
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.css']
})
export class CategoryConfigComponent implements OnInit {

  public category: CategoryPreference = null;
  public preferences: UserPreferences = null;
  public bannedPublishersIds: number[] = [];
  private categoryId: number;
  public publishersRelevance: { [id: number]: PublisherRelevance; } = {};
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, private userProfile: UserProfileService) {

  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params['id'];
    this.preferences = this.client.getUserPreferences();
    this.category = this.preferences.getCategory(this.categoryId);
    this.updateBannedPublishers(this.categoryId);
  }

  private updateBannedPublishers(categoryId: number) {
    this.publishersRelevance = this.userProfile.getRemovedPublishersForCategory(categoryId);
    this.bannedPublishersIds = [];
    for (var key in this.publishersRelevance) {
      this.bannedPublishersIds.push(+key);
    }
  }

  public onPackageChange($event) {
    this.client.setUserPreferences(this.preferences);
  }

  public undoPublisherOptOut(publisherId: number) {
    this.userProfile.removePublishersRelevance(this.categoryId, publisherId);
    this.updateBannedPublishers(this.categoryId);
  }

}



export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
