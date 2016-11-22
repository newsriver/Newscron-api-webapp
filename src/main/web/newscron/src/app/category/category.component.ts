import { NgModule, Component, OnInit, Input } from '@angular/core';
import {ArticleComponent} from '../article/article.component';
import {Section, Category, Article} from '../newscron-client.service';

@NgModule({
  declarations: [ArticleComponent]
})

@Component({
  selector: 'section',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {


  @Input() section: Section;

  constructor() {

  }

  ngOnInit() {
  }

}
