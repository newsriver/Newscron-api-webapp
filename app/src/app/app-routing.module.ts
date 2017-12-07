import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryModule,CategoryComponent } from './category/category.component';
import { FeaturedModule,FeaturedComponent } from './featured/featured.component';
import { DigestModule,DigestsListComponent } from './digests-list/digests-list.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { ConfigModule,ConfigComponent } from './config/config.component';
import { SearchModule,SearchComponent } from './search/search.component';
import { WelcomeModule,WelcomeComponent } from './welcome/welcome.component';
import { MainContentModule,MainContentComponent } from './main-content/main-content.component';
import { GeneralConfigComponent } from './config/general-config/general-config.component';

import { environment } from '../environments/environment';

export const appRoutes: Routes = [
  {
    path: '', component: MainContentComponent,
    children: [
      { path: '', component: DigestsListComponent, data: { exitOnBack: true } },
      { path: 'top', component: FeaturedComponent, data: { exitOnBack: true } },
      { path: 'search/:searchPhrase', component: SearchComponent, data: { exitOnBack: true } },
      { path: 'search/:language/:searchPhrase', component: SearchComponent, data: { exitOnBack: true } },
      { path: 'category/:id/:name', component: CategoryComponent, data: { exitOnBack: true } }
    ]
  },
  {
    path: 'config', component: ConfigComponent,
    children: [
      { path: '', component: GeneralConfigComponent},
      { path: 'category/:id', component: CategoryConfigComponent }
    ]
  },
  {
    path: 'welcome/:continent', component: WelcomeComponent,
  },
  {
    path: 'welcome', component: WelcomeComponent,
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];



@NgModule({
  imports: [
    MainContentModule,
    WelcomeModule,
    CategoryModule,
    DigestModule,
    ConfigModule,
    SearchModule,
    FeaturedModule,
    RouterModule.forRoot(appRoutes, { useHash: environment.useLocationHash })
  ],
  exports: [
   RouterModule
 ]
})
export class AppRoutingModule { }
