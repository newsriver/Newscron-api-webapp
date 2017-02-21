import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent, ValidSectionFilter, SortCategory } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { WelcomeComponent, KeysPipe, CategoryAmmountPipe, EditionPerContinent } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent, SortArticle} from './section/section.component';
import { MaterialModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    SortCategory,
    SortArticle,
    CategoryAmmountPipe,
    EditionPerContinent,
    ValidSectionFilter,
    WelcomeComponent,
    SectionComponent,
    AppComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [NewscronClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
