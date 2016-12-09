import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent, ValidSectionFilter } from './app.component';
import { AppComponents, AppRoutes } from "./app.routing";
import { ArticleComponent } from './article/article.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {NewscronClientService} from './newscron-client.service';
import {SectionComponent} from './section/section.component';



@NgModule({
    declarations: [
        AppComponent,
        ArticleComponent,
        ValidSectionFilter,
        WelcomeComponent,
        SectionComponent,
        AppComponents
    ],
    imports: [
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
