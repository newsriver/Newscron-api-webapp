import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';

import { NgModule } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform, Inject } from '@angular/core';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences } from '../newscron-client.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoggerService } from '../logger.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegionComponent } from './region/region.component';
import { EditionComponent } from './edition/edition.component';
import { CategoriesComponent } from './categories/categories.component';
import { ConfigModule } from '../config/config.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  transform(items: any, args: any[]): any {
    return Object.keys(items);
  }
}

@Pipe({
  name: 'categoryAmmount'
})
export class CategoryAmmountPipe implements PipeTransform {
  transform(item: any, args: any[]): any {
    switch (item) {
      case 5:
        return "few";
      case 10:
        return "some";
      case 15:
        return "standard";
      case 20:
        return "many";
      case 25:
        return "extreme";
      default:
        return "none";
    }
  }
}


@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: []
})

export class WelcomeComponent implements OnInit {

  @Output() setWelcomeStep = new EventEmitter();
  public loading: boolean = false;
  public continent: string;
  public step: number = 0;
  public packagesIds: number[] = [];
  public categories: CategoryPreference[] = [];
  private unsubscribe: Subject<void> = new Subject();

  constructor(private client: NewscronClientService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, public logger: LoggerService) {

  }

  ngOnInit() {
    this.step = 1
    this.route.params.takeUntil(this.unsubscribe).subscribe(params => {
      this.continent = params.continent;
      if (this.continent != null) {
        this.step = 2;
        this.setWelcomeStep.emit(this.step);
      }
    });



    if (this.client.hasPreferences() && this.step == 1) {

      setTimeout(() => {
        let dialogRef = this.dialog.open(ResetConfirmationDialoug, {
          data: {}
        }
        );
      });
    }

    this.boot(null);
  }

  ngAfterViewChecked() {

  }

  close() {
    this.step = 0;
    this.setWelcomeStep.emit(this.step);
  }

  back() {
    this.step--;
    if (this.step == 1) {
      this.router.navigate(['/welcome']);
      return;
    }
    window.scrollTo(0, 0);
    this.setWelcomeStep.emit(this.step);
    this.logger.trackEvent("SetUp", "step", "" + this.step, { "step": this.step });
  }

  next() {
    this.step++;
    window.scrollTo(0, 0);
    this.setWelcomeStep.emit(this.step);
    this.logger.trackEvent("SetUp", "step", "" + this.step, { "step": this.step });
  }

  finish() {
    this.step = -1;
    var preferences: UserPreferences = new UserPreferences();
    preferences.categories = this.categories;
    preferences.searchLanguage = this.client.getUserPreferences().searchLanguage;
    this.client.resetUserPreferences(preferences, true);
    this.setWelcomeStep.emit(this.step);
    this.router.navigate(['/']);
    this.logger.trackEvent("SetUp", "completed", null, null);
  }

  public hasOnePackage() {
    return this.packagesIds.length > 0
  }



  private onPackageChange() {
    this.boot(this.packagesIds);
  }



  public selectCategory(e) {
    if (e.target.checked) {
      this.categories[e.target.value].amount = 5;
    } else {
      this.categories[e.target.value].amount = 0;
    }
  }


  private boot(packagesIds: number[]) {
    this.loading = true;
    this.client.boot(packagesIds).takeUntil(this.unsubscribe).subscribe(bootConfig => {
      this.loading = false;
      if (bootConfig != null) {
        this.categories = bootConfig.categories;
      }
    });
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

@Component({
  selector: 'resetconfirm-dialog',
  templateUrl: './reset-confirmation-dialog.html',
  styleUrls: ['./dialog.css']
})
export class ResetConfirmationDialoug {

  public removeall: boolean = false;
  constructor(public dialogRef: MatDialogRef<ResetConfirmationDialoug>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {

  }

  cancel() {
    this.router.navigate(['/']);
    this.dialogRef.close('close');
  }
}


export class Package {
  public id: number;
  public name: string = null;
  public continent: string;
  public selected: boolean = false;
}

export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    RouterModule,
    BrowserAnimationsModule,
    ConfigModule
  ],
  entryComponents: [
    ResetConfirmationDialoug
  ],
  exports: [WelcomeComponent],
  declarations: [WelcomeComponent, RegionComponent, EditionComponent, CategoriesComponent, ResetConfirmationDialoug, KeysPipe, CategoryAmmountPipe],
  providers: [NewscronClientService, LoggerService],
})
export class WelcomeModule { }
