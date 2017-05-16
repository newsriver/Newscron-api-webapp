import { Component, OnInit } from '@angular/core';
import {NewscronClientService, Article, StreamChunk} from '../newscron-client.service';
import { StreamChunkComponent } from '../stream-chunk/stream-chunk.component';



@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  public articles: Article[] = [];
  public chunks: StreamChunk[] = [];
  public loading: boolean = true;

  constructor(private client: NewscronClientService) {
    this.chunks = this.client.stream();
  }

  ngOnInit() {
    this.client.getCategories().subscribe(categories => {
      if (categories != null) {
        this.loading = true;
        this.client.updateStream(categories).subscribe(success => {
          this.loading = false;
          if (success) {
            this.chunks = this.client.stream();
          }
        });
      }
    });
  }

}
