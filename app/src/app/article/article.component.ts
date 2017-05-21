import { Component, OnInit, Input } from '@angular/core';
import {Section, Category, Article} from '../newscron-client.service';
import { CordovaService } from '../cordova.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  public isDigest = false;

  @Input() article: Article;
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute) {

    if (route.snapshot.url[0] != null && route.snapshot.url[0].path != null && route.snapshot.url[0].path === "digest") {
      this.isDigest = true;
    }

  }


  ngOnInit() {
  }


  public openLinkInBrowser() {
    this.cordovaService.openLinkInBrowser(this.article.url);
  }



}
