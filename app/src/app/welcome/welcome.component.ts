import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform, Inject } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences} from '../newscron-client.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

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

  constructor(private client: NewscronClientService, private router: Router, private route: ActivatedRoute, public dialog: MdDialog) {

  }

  ngOnInit() {
    this.step = 1
    this.route.params.subscribe(params => {
      this.continent = params.continent;
      if (this.continent != null) {
        this.step = 2;
        this.setWelcomeStep.emit(this.step);
      }
    });

    if (this.client.hasPreferences()) {
      let dialogRef = this.dialog.open(ResetConfirmationDialoug, {
        data: {}
      }
      );
    }
    this.boot(null);
  }

  close() {
    this.step = 0;
    this.setWelcomeStep.emit(this.step);
  }

  back() {
    this.step--;
    this.setWelcomeStep.emit(this.step);
  }

  next() {
    this.step++;
    this.setWelcomeStep.emit(this.step);
  }

  finish() {
    this.step = -1;
    var preferences: UserPreferences = new UserPreferences();
    preferences.categories = this.categories;
    this.client.resetUserPreferences(preferences, true);
    this.setWelcomeStep.emit(this.step);
    this.router.navigate(['/']);

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
    this.client.boot(packagesIds).subscribe(bootConfig => {
      this.loading = false;
      if (bootConfig != null) {
        this.categories = bootConfig.categories;
      }
    });
  }

}

@Component({
  selector: 'resetconfirm-dialog',
  templateUrl: './reset-confirmation-dialog.html',
  styleUrls: ['./dialog.css']
})
export class ResetConfirmationDialoug {

  public removeall: boolean = false;
  constructor(public dialogRef: MdDialogRef<ResetConfirmationDialoug>, @Inject(MD_DIALOG_DATA) public data: any, private router: Router) {

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
