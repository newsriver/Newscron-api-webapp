import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import { NgModule } from '@angular/core';
import { HostListener, Component, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NewscronClientService, } from '../newscron-client.service';
import { Digest, Article } from '../newscron-model';
import { DigestComponent } from './digest/digest.component';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { SectionModule, SectionComponent } from '../section/section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CordovaService } from '../cordova.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';

//Scroll hack -> romeve once https://github.com/angular/angular/pull/20030 is mergeg
//-------
function _window(): any {
  // return the global native browser window object
  return window;
}
//------

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
  private unsubscribe: Subject<void> = new Subject();

  //Scroll hack -> romeve once https://github.com/angular/angular/pull/20030 is mergeg
  //-------
  private scrollPosition: number[] = [];
  private lastId = "/news/digest";
  //---

  //Scroll hack -> romeve router from constructor
  constructor(private client: NewscronClientService, public snackBar: MatSnackBar, public ga: GoogleAnalyticsService, public cordova: CordovaService, private router: Router) {

  }

  ngOnInit() {
    this.loading = true;
    this.client.refreshListener().takeUntil(this.unsubscribe).subscribe(refresh => {
      if (refresh) {
        this.digestsData = this.client.digestsList();
        this.digests = [];
        this.counter = 0;
        this.loadDigest(2);
        this.downloadDigest();
      }
    });

    //Scroll hack -> romeve once https://github.com/angular/angular/pull/20030 is mergeg
    //-------
    this.router.events.takeUntil(this.unsubscribe).subscribe(e => {
      if (e instanceof NavigationStart) {
        // store the scroll position of the current stable navigations
        this.scrollPosition[this.lastId] = this.getCurrentScrollPosition();
      } else if (e instanceof NavigationEnd) {
        this.lastId = e.url;
        this.restorePositionOrScrollIntoView(this.scrollPosition[this.lastId]);
      }
    });
    //-----

    this.ga.trackPage("/");
  }

  //Scroll hack -> romeve once https://github.com/angular/angular/pull/20030 is mergeg
  //-------
  private restorePositionOrScrollIntoView(position: number): void {
    setTimeout(() => {
      _window().scrollTo(0, position);
    }, 0);

  }

  protected getCurrentScrollPosition(): number {
    return _window().scrollY;
  }
  //-----

  private downloadDigest() {
    this.loading = true;
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

  loadDigest(count: number) {
    for (let i = 0; i < count; i++) {
      if (this.counter < this.digestsData.length) {
        this.digests.push(this.digestsData[this.counter]);
        this.counter++;
      }
    }
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    SectionModule
  ],
  exports: [DigestsListComponent],
  declarations: [DigestsListComponent, DigestComponent],
  providers: [NewscronClientService, GoogleAnalyticsService, CordovaService],
})
export class DigestModule { }
