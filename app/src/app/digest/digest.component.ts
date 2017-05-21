import { Component, Input, OnInit } from '@angular/core';
import {NewscronClientService, Article, Digest} from '../newscron-client.service';
import {ArticleComponent} from '../article/article.component';

@Component({
  selector: 'digest',
  templateUrl: './digest.component.html',
  styleUrls: ['./digest.component.css']
})
export class DigestComponent implements OnInit {

  @Input() digest: Digest;
  constructor() { }

  ngOnInit() {
  }

}
