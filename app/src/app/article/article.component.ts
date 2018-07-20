import { NgModule, Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Section, Category, Article, Publisher } from '../newscron-model';
import { CordovaService } from '../cordova.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NewscronClientService } from '../newscron-client.service';
import { Pipe, PipeTransform } from '@angular/core';
import { LoggerService } from '../logger.service';
import { UserProfileService } from '../user-profile.service';
import { PublisherRelevanceComponent, PublisherDialog } from './publisher-relevance/publisher-relevance.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
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
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public logger: LoggerService, private userProfile: UserProfileService) {


  }


  ngOnInit() {

  }

  ngOnDestroy() {
  }

  public openLinkInBrowser() {
    let url: string = this.article.url;
    if (this.userProfile.getGeneralReadability() && this.article.id != null && this.article.topicId) {
      url = environment.serviceURL + "/readability/" + this.article.topicId + "/" + this.article.id;
    }
    this.cordovaService.openLinkInBrowser(url);
    this.trackEvent();
  }

  public trackEvent() {
    if (this.article.category == null) {
      this.logger.trackEvent("Article", "click", null, null);
    } else {
      this.logger.trackEvent("Article", "click", this.article.category.name, { "category": this.article.category.name });
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  entryComponents: [
    PublisherDialog
  ],
  exports: [ArticleComponent],
  declarations: [ArticleComponent, EscapeHtmlPipe, PublisherRelevanceComponent, PublisherDialog],
  providers: [NewscronClientService, CordovaService, LoggerService, UserProfileService],
})
export class ArticleModule { }
