import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent, ValidSectionFilter, SortCategory } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { ArticleComponent } from './article/article.component';
import { CategoryComponent } from './category/category.component';
import { WelcomeComponent, KeysPipe, CategoryAmmountPipe, EditionPerContinent } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent, SortArticle} from './section/section.component';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule}  from '@angular/platform-browser/animations';
import { StreamComponent } from './stream/stream.component';
import { StreamChunkComponent } from './stream-chunk/stream-chunk.component';


@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
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
    StreamComponent,
    StreamChunkComponent
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
  providers: [NewscronClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
