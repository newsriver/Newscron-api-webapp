import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { ArticleComponent, PublisherDialog, CategoryDialog } from './article/article.component';
import { CategoryComponent } from './category/category.component';
import { WelcomeComponent, KeysPipe, CategoryAmmountPipe } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent, SortArticle} from './section/section.component';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule}  from '@angular/platform-browser/animations';
import { CordovaService } from './cordova.service';
import { DigestsListComponent } from './digests-list/digests-list.component';
import { DigestComponent } from './digest/digest.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { MainContentComponent,ValidSectionFilter, SortCategory } from './main-content/main-content.component';
import { ConfigComponent } from './config/config.component';
import { PackageSelectionComponent,EditionPerContinent } from './config/package-selection/package-selection.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    PublisherDialog,
    CategoryDialog,
    KeysPipe,
    SortCategory,
    SortArticle,
    CategoryAmmountPipe,
    EditionPerContinent,
    ValidSectionFilter,
    WelcomeComponent,
    SectionComponent,
    CategoryComponent,
    AppComponents,
    DigestsListComponent,
    DigestComponent,
    CategoryConfigComponent,
    MainContentComponent,
    ConfigComponent,
    PackageSelectionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    RouterModule.forRoot(AppRoutes)
  ],
  entryComponents: [
    PublisherDialog,
    CategoryDialog
  ],
  providers: [CordovaService, NewscronClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
