import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent, ValidSectionFilter, SortCategory } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { ArticleComponent } from './article/article.component';
import { WelcomeComponent, KeysPipe, CategoryAmmountPipe } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent, SortArticle} from './section/section.component';
import { MaterialModule } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        ArticleComponent,
        KeysPipe,
        SortCategory,
        SortArticle,
        CategoryAmmountPipe,
        ValidSectionFilter,
        WelcomeComponent,
        SectionComponent,
        AppComponents
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        RouterModule,
        RouterModule.forRoot(AppRoutes)
    ],
    providers: [NewscronClientService],
    bootstrap: [AppComponent]
})
export class AppModule { }
