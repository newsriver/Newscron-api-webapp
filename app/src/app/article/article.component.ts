import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Section, Category, Article, Publisher } from '../newscron-client.service';
import { CordovaService } from '../cordova.service';
import { Router, ActivatedRoute } from '@angular/router';

import { NewscronClientService } from '../newscron-client.service';
import { Pipe, PipeTransform } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics.service';

import { PublisherRelevanceComponent } from './publisher-relevance/publisher-relevance.component';


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
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public ga: GoogleAnalyticsService) {

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




}
