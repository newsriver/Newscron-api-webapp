import { Component, OnInit, Input } from '@angular/core';
import {Section, Category, Article} from '../newscron-client.service';
import { CordovaService } from '../cordova.service';


@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  constructor(public cordovaService: CordovaService) { }


  ngOnInit() {
  }

  public openLinkInBrowser() {
    this.cordovaService.cordova.InAppBrowser.open(this.article.url, "_system", "location=yes,enableViewportScale=yes,hidden=no,mediaPlaybackRequiresUserAction=yes");
  }


}
