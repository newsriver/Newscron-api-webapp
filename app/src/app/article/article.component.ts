import { NgModule,Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Section, Category, Article, Publisher } from '../newscron-model';
import { CordovaService } from '../cordova.service';
import { RouterModule,Router, ActivatedRoute } from '@angular/router';
import { NewscronClientService } from '../newscron-client.service';
import { Pipe, PipeTransform } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { PublisherRelevanceComponent,PublisherDialog } from './publisher-relevance/publisher-relevance.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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



  @Input() article: Article;
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public ga: GoogleAnalyticsService) {


  }


  ngOnInit() {

  }

  ngOnDestroy() {
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

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule
  ],
  entryComponents: [
    PublisherDialog
  ],
  exports: [ArticleComponent],
  declarations: [ArticleComponent,EscapeHtmlPipe,PublisherRelevanceComponent,PublisherDialog],
  providers: [NewscronClientService,CordovaService,GoogleAnalyticsService],
})
export class ArticleModule {}
