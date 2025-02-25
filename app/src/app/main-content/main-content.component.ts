import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { NgModule, OnInit, Component, ViewChild, NgZone } from '@angular/core';
import { WelcomeModule, WelcomeComponent } from '../welcome/welcome.component';
import { CategoryModule } from '../category/category.component';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference } from '../newscron-client.service';
import { Section } from '../newscron-model';
import { Injectable } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CordovaService } from '../cordova.service';
import { UserProfileService } from '../user-profile.service';
import { environment } from '../../environments/environment';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';


const SMALL_WIDTH_BREAKPOINT = 767;


@Component({
  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
  providers: []
})
export class MainContentComponent implements OnInit {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  public bootConfig: BootstrapConfiguration;
  public categories: CategoryPreference[] = [];
  public displayWelcome: boolean = false;
  public version: string = "v";
  public searchInputFocus: boolean = false;
  private unsubscribe: Subject<void> = new Subject();
  @ViewChild("searhInput") searhInput: ElementRef;

  constructor(private client: NewscronClientService, public router: Router, public cordovaService: CordovaService, zone: NgZone, private userProfile: UserProfileService) {
    this.version += environment.version;
    if (cordovaService.onCordova) {
      this.version += " a";
    } else {
      this.version += " w";
    }
    // TODO(josephperrott): Move to CDK breakpoint management once available.
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit() {
    this.router.events.filter(event => event instanceof NavigationEnd).takeUntil(this.unsubscribe).subscribe((event: NavigationEnd) => {
      //clear search phrase if route is not search
      if (!event.url.startsWith('/news/search')) {
        this.searchPhrase = "";
      }
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });


    if (this.client.getUserPreferences() == null) {

      if (this.cordovaService.onCordova) {
        this.router.navigate(['/welcome']);
      } else {
        this.displayWelcome = true;
      }

    }


    this.client.refreshListener().takeUntil(this.unsubscribe).subscribe(refresh => {
      if (refresh) {
        if (this.client.getUserPreferences() == null) {
          this.displayWelcome = true;
        } else {
          this.categories = this.client.getUserPreferences().categories;
        }
      }
    });
  }


  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }


  public searchPhrase: string;
  public search(e) {
    if (this.searchPhrase.length > 0) {
      this.router.navigate(['/news/search', this.searchPhrase]);
    }
    this.searhInput.nativeElement.blur()
  }

  public onSearchKey(event) {
    if (event.keyCode == 13) {
      this.search(null);
    }
  }


  public onSearchBlur() {
    this.searchInputFocus = false;
  }

  public onSearchFocus() {
    this.searchInputFocus = true;
  }

  public setGeneralReadability(toggleValue: MatSlideToggleChange) {
    this.userProfile.setGeneralReadability(toggleValue.checked);
  }
  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    RouterModule,
    WelcomeModule,
    CategoryModule
  ],
  exports: [MainContentComponent],
  declarations: [MainContentComponent],
  providers: [NewscronClientService, CordovaService, UserProfileService],
})
export class MainContentModule { }
