import { Component, OnInit } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {NewscronClientService, Article, Digest} from '../newscron-client.service';
import { DigestComponent } from '../digest/digest.component';


@Component({
  selector: 'app-digests-list',
  templateUrl: './digests-list.component.html',
  styleUrls: ['./digests-list.component.css']
})
export class DigestsListComponent implements OnInit {
  public articles: Article[] = [];
  public digestsData: Digest[] = [];
  public digests: Digest[] = [];
  public loading: boolean = true;
  public counter: number = 0;

  constructor(private client: NewscronClientService, public snackBar: MdSnackBar) {

  }

  ngOnInit() {
    this.loading = true;
    this.client.refreshListener().subscribe(refresh => {
      if (refresh) {
        this.digestsData = this.client.digestsList();
        this.digests = [];
        this.loadDigest(2);

        this.client.assembleDigest().subscribe(digest => {
          this.loading = false;
          if (digest != null) {
            //since digestsData is a reference from the client we don't need to update it
            //it will already be since the assembleDigest method is unshifting it.
            this.digests.unshift(digest);
            this.counter++;
            //don't display this currently it is quite useless.. 
            //this.snackBar.open('New Digest Available - Scroll to top', 'OK', { duration: 5000, });
          }
        });
      }
    });
  }

  loadDigest(count: number) {
    for (let i = 0; i < count; i++) {
      if (this.counter < this.digestsData.length) {
        this.digests.push(this.digestsData[this.counter]);
        this.counter++;
      }
    }
  }


}
