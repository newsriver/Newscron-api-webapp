import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { FeaturedComponent } from './featured/featured.component';
import { DigestsListComponent } from './digests-list/digests-list.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { ConfigComponent } from './config/config.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SearchComponent } from './search/search.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CategoriesComponent } from './welcome/categories/categories.component';
import { EditionComponent } from './welcome/edition/edition.component';
import { RegionComponent } from './welcome/region/region.component';



export const AppRoutes: Routes = [
  {
    path: '', component: MainContentComponent,
    children: [
      { path: '', component: DigestsListComponent },
      { path: 'top', component: FeaturedComponent },
      { path: 'search/:searchPhrase', component: SearchComponent },
      { path: 'search/:language/:searchPhrase', component: SearchComponent },
      { path: 'category/:id/:name', component: CategoryComponent },
    ]
  },
  {
    path: 'config', component: ConfigComponent,
    children: [
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


export const AppComponents: any = [
  CategoryComponent,
  FeaturedComponent,
  DigestsListComponent
];
