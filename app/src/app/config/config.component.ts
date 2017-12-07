import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PackageSelectionComponent, EditionPerContinent } from './package-selection/package-selection.component';
import { CategoryConfigComponent } from './category-config/category-config.component';
import { GeneralConfigComponent } from './general-config/general-config.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Location} from '@angular/common';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(private location: Location) {
    }
    back() {
        this.location.back();
    }

  ngOnInit() {
     window.scrollTo(0, 0);
  }

}

@NgModule({
  imports: [BrowserAnimationsModule, BrowserModule, MatButtonModule, RouterModule, FormsModule, MatTabsModule, MatSliderModule],
  exports: [ConfigComponent, PackageSelectionComponent, CategoryConfigComponent,GeneralConfigComponent],
  declarations: [ConfigComponent, PackageSelectionComponent, CategoryConfigComponent,GeneralConfigComponent, EditionPerContinent],
  providers: [],
})
export class ConfigModule { }
