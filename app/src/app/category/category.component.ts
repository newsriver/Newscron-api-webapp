import { NgModule, Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService } from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';
import { UserProfileService } from '../user-profile.service';
import { GoogleAnalyticsService } from '../google-analytics.service';
@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {

  public categoryId: number;
  public section: Section;
  public name: string;
  public loading: boolean = true;
  constructor(private client: NewscronClientService, private userProfile: UserProfileService, private route: ActivatedRoute, private router: Router, private chageDetector: ChangeDetectorRef, public ga: GoogleAnalyticsService) {

  }

  ngOnInit() {

    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.subscribe(params => {

      this.categoryId = params.id;
      this.name = params.name;
      this.ga.trackPage("/category/" + this.name.toLowerCase());
      this.loading = true;
      this.section = null;
      this.chageDetector.markForCheck();

      this.client.category(this.categoryId).subscribe(section => {
        this.section = section;
        this.loading = false;
        this.chageDetector.markForCheck();
      });

      this.userProfile.getProfileUpdateObserver().subscribe(result => {
        if (result != null && result["publisher-relevance"] != null && result["publisher-relevance"] == this.categoryId) {
          this.chageDetector.markForCheck();
        }
      });


    });
  }
}
