import { NgModule, Component, OnInit, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService } from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { SectionModule, SectionComponent } from '../section/section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchPhrase: string;
  public section: Section;
  public loading: boolean = true;
  public language: string = "";
  public showSettings: boolean = false;
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, public ga: GoogleAnalyticsService) {

  }



  ngOnInit() {
    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.subscribe(params => {
      this.searchPhrase = params.searchPhrase;
      this.language = params.language;
      if (this.language == null) {
        if (this.client.getUserPreferences().searchLanguage == null) {
          this.showSettings = true;
          this.language = "";
        } else {
          this.language = this.client.getUserPreferences().searchLanguage;
        }
      }
      this.searchArticles();

    });
    this.ga.trackPage("/search");
  }

  public togleSettings() {
    this.showSettings = !this.showSettings;
  }

  public setLanguage(selectValue: MatSelectChange) {
    let preferences = this.client.getUserPreferences();
    preferences.searchLanguage = selectValue.value;
    this.client.setUserPreferences(preferences);
    this.router.navigate(['/search', selectValue.value, this.searchPhrase]);
  }

  public search(event: any) {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/search', this.language, this.searchPhrase]);
  }

  public searchArticles() {
    this.loading = true;
    this.section = null;

    let query: string = "text:\"" + this.searchPhrase + "\"~50";
    if (this.language.length > 0) {
      query += " AND language:" + this.language;
    }
    this.client.search(query).subscribe(section => {
      this.section = section;
      this.loading = false;
    });
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    SectionModule
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent],
  providers: [NewscronClientService, GoogleAnalyticsService],
})
export class SearchModule { }
