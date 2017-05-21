import { Component, OnInit } from '@angular/core';
import {NewscronClientService, Article, Digest} from '../newscron-client.service';
import { DigestComponent } from '../digest/digest.component';


@Component({
  selector: 'app-digests-list',
  templateUrl: './digests-list.component.html',
  styleUrls: ['./digests-list.component.css']
})
export class DigestsListComponent implements OnInit {

  public articles: Article[] = [];
  public digests: Digest[] = [];
  public loading: boolean = true;

  constructor(private client: NewscronClientService) {
    this.digests = this.client.digestsList();
  }

  ngOnInit() {
    this.client.getCategories().subscribe(categories => {
      if (categories != null) {
        this.loading = true;
        this.client.loadDigest(categories).subscribe(success => {
          this.loading = false;
          if (success) {
            this.digests = this.client.digestsList();
          }
        });
      }
    });
  }

}
