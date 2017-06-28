import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import {MdProgressSpinnerModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdDialogModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdSidenavModule} from '@angular/material';
import {MdSnackBarModule} from '@angular/material';
import {NoopAnimationsModule}  from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { ArticleComponent, PublisherDialog, EscapeHtmlPipe } from './article/article.component';
import { CategoryComponent } from './category/category.component';
import { WelcomeComponent, ResetConfirmationDialoug, KeysPipe, CategoryAmmountPipe } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent, SortArticle} from './section/section.component';

import { CordovaService } from './cordova.service';
import { DigestsListComponent } from './digests-list/digests-list.component';
import { DigestComponent } from './digest/digest.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { MainContentComponent, ValidSectionFilter, SortCategory } from './main-content/main-content.component';
import { ConfigComponent } from './config/config.component';
import { PackageSelectionComponent, EditionPerContinent } from './config/package-selection/package-selection.component';
import { SearchComponent } from './search/search.component';
import { RegionComponent } from './welcome/region/region.component';
import { EditionComponent } from './welcome/edition/edition.component';
import { CategoriesComponent } from './welcome/categories/categories.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    PublisherDialog,
    EscapeHtmlPipe,
    KeysPipe,
    SortCategory,
    SortArticle,
    CategoryAmmountPipe,
    EditionPerContinent,
    ValidSectionFilter,
    WelcomeComponent,
    ResetConfirmationDialoug,
    SectionComponent,
    CategoryComponent,
    AppComponents,
    DigestsListComponent,
    DigestComponent,
    CategoryConfigComponent,
    MainContentComponent,
    ConfigComponent,
    PackageSelectionComponent,
    SearchComponent,
    RegionComponent,
    EditionComponent,
    CategoriesComponent
  ],
  imports: [
    NoopAnimationsModule,
    MdMenuModule,
    MdSidenavModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    MdButtonModule,
    MdSnackBarModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    RouterModule.forRoot(AppRoutes)
  ],
  entryComponents: [
    PublisherDialog, ResetConfirmationDialoug
  ],
  providers: [CordovaService, NewscronClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
