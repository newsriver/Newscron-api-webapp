import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { FeaturedComponent } from './featured/featured.component';

export const AppRoutes: Routes = [
    { path: 'category/:id/:name', component: CategoryComponent },
    { path: '', component: FeaturedComponent }
];


export const AppComponents: any = [
    CategoryComponent,
    FeaturedComponent
];
