import { Component, OnInit, Input, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Section, Category, Article, Publisher } from '../newscron-client.service';
import { CordovaService } from '../cordova.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewscronClientService } from '../newscron-client.service';
import { Pipe, PipeTransform } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { UserProfileService } from '../user-profile.service';


@Pipe({ name: 'escapeHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: string, args: any[] = []) {
    if (value == null) return "";
    return value.replace(new RegExp("<highlighted>", 'g'), "<span>").replace(new RegExp("</highlighted>", 'g'), "</span>")
  }
}

@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit {

  public isDigest = true;

  @Input() article: Article;
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public dialog: MatDialog, public ga: GoogleAnalyticsService, private userProfile: UserProfileService) {

    if (route.snapshot.url[0] != null && route.snapshot.url[0].path != null && route.snapshot.url[0].path === "top") {
      this.isDigest = false;
    }
  }


  ngOnInit() {
  }




  public openLinkInBrowser() {
    this.cordovaService.openLinkInBrowser(this.article.url);
    this.trackEvent();
  }

  public trackEvent() {
    if (this.article.category == null) {
      this.ga.trackEvent("Article", "click", null);
    } else {
      this.ga.trackEvent("Article", "click", this.article.category.name);
    }
  }

  publisherDialog(publisher: Publisher, category: Category) {
    let dialogRef = this.dialog.open(PublisherDialog, {
      data: { "publisher": publisher, "category": category }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      //this.selectedOption = result;
    });
  }


}


@Component({
  selector: 'publisher-dialog',
  templateUrl: './publisher-dialog.html',
  styleUrls: ['./dialog.css']
})
export class PublisherDialog {

  public removeall: boolean = false;
  relevance: string;

  constructor(public dialogRef: MatDialogRef<PublisherDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private client: NewscronClientService, private userProfile: UserProfileService) {

  }

  save(relevance: number) {
    this.userProfile.setPublishersRelevance(this.data.category.id, this.data.publisher.id, relevance);
    this.client.publishersOptOut(this.data.publisher, this.data.category);
    this.dialogRef.close('close');
  }
}
