import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PackageSelectionComponent,EditionPerContinent } from './package-selection/package-selection.component';
import { CategoryConfigComponent } from './category-config/category-config.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@NgModule({
  imports: [BrowserModule,MatButtonModule,RouterModule,FormsModule,MatTabsModule],
  exports: [ConfigComponent,PackageSelectionComponent,CategoryConfigComponent],
  declarations: [ConfigComponent,PackageSelectionComponent,CategoryConfigComponent,EditionPerContinent],
  providers: [],
})
export class ConfigModule {}
