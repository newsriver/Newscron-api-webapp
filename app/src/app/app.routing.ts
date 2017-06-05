import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { FeaturedComponent } from './featured/featured.component';
import { DigestsListComponent } from './digests-list/digests-list.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { ConfigComponent } from './config/config.component';
import { MainContentComponent } from './main-content/main-content.component';



export const AppRoutes: Routes = [
  {
    path: '', component: MainContentComponent,
    children: [
      { path: '', component: DigestsListComponent },
      { path: 'top', component: FeaturedComponent },
      { path: 'category/:id/:name', component: CategoryComponent }
    ]
  },
  {
    path: 'config', component: ConfigComponent,
    children: [
      { path: 'category/:id', component: CategoryConfigComponent }
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];


export const AppComponents: any = [
  CategoryComponent,
  FeaturedComponent,
  DigestsListComponent
];
