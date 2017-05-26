import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { FeaturedComponent } from './featured/featured.component';
import { DigestsListComponent } from './digests-list/digests-list.component';

export const AppRoutes: Routes = [
  { path: 'category/:id/:name', component: CategoryComponent },
  { path: '', component: FeaturedComponent },
  { path: 'digest', component: DigestsListComponent }
];


export const AppComponents: any = [
  CategoryComponent,
  FeaturedComponent,
  DigestsListComponent
];
