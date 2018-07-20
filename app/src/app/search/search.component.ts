import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import { NgModule, Component, OnInit, Input, Inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService } from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';
import { LoggerService } from '../logger.service';
import { SectionModule, SectionComponent } from '../section/section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

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
  private unsubscribe: Subject<void> = new Subject();
  public error: String = null;

  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, public logger: LoggerService, public dialog: MatDialog) {
  }



  ngOnInit() {
    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.takeUntil(this.unsubscribe).subscribe(params => {
      this.searchPhrase = params.searchPhrase;
      this.language = params.language;
      if (this.language == null) {
        if (this.client.getUserPreferences().searchLanguage == null) {
          this.togleSettings();
          this.language = "";
        } else {
          this.language = this.client.getUserPreferences().searchLanguage;
        }
      }
      this.searchArticles();

    });
    this.logger.trackPage("/search");
  }

  public togleSettings() {
    let dialogRef = this.dialog.open(SettingsDialog, {
      data: { "language": this.language, "searchPhrase": this.searchPhrase }
    }
    );
    dialogRef.afterClosed().subscribe((language: string) => {
      if (language != null) {
        let preferences = this.client.getUserPreferences();
        preferences.searchLanguage = language;
        this.client.setUserPreferences(preferences);
        this.router.navigate(['/news/search', language, this.searchPhrase]);
      }
    });
  }

  public search(event: any) {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/news/search', this.language, this.searchPhrase]);
  }

  public searchArticles() {
    this.loading = true;
    this.section = null;
    this.error = null;

    let query: string = "text:\"" + this.searchPhrase + "\"~50";
    if (this.language.length > 0) {
      query += " AND language:" + this.language;
    }
    this.client.search(query).takeUntil(this.unsubscribe).subscribe(section => {
      this.section = section;
      this.loading = false;
    }
      , error => {
        this.loading = false;
        console.log(error);
        this.error = "Unable to complete the news search. Please make sure your devie is connected to Internet and try again.";
      }
    );

  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

@Component({
  selector: 'settings-dialog',
  templateUrl: './settings-dialog.html',
  styleUrls: ['./dialog.css']
})
export class SettingsDialog {

  public language: string = "";
  public searchPhrase: string;
  constructor(public dialogRef: MatDialogRef<SettingsDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.language = data.language;
    this.searchPhrase = data.searchPhrase;
  }
  public save() {
    this.dialogRef.close(this.language);
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
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    SectionModule
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent, SettingsDialog],
  providers: [NewscronClientService, LoggerService],
  entryComponents: [SettingsDialog],
})
export class SearchModule { }
