import { Component, OnInit, Input } from '@angular/core';
import {Section, Category, Article} from '../newscron-client.service';


@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Article[];
  constructor() { }

  ngOnInit() {
  }

}
