import { Component, Input, OnInit } from '@angular/core';
import {NewscronClientService, Article, StreamChunk} from '../newscron-client.service';
import {ArticleComponent} from '../article/article.component';

@Component({
  selector: 'stream-chunk',
  templateUrl: './stream-chunk.component.html',
  styleUrls: ['./stream-chunk.component.css']
})
export class StreamChunkComponent implements OnInit {

  @Input() chunk: StreamChunk;
  constructor() { }

  ngOnInit() {
  }

}
