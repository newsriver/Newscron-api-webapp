import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryModule, CategoryComponent } from './category/category.component';
import { FeaturedModule, FeaturedComponent } from './featured/featured.component';
import { DigestModule, DigestsListComponent } from './digests-list/digests-list.component';
import { CategoryConfigComponent } from './config/category-config/category-config.component';
import { ConfigModule, ConfigComponent } from './config/config.component';
import { SearchModule, SearchComponent } from './search/search.component';
import { WelcomeModule, WelcomeComponent } from './welcome/welcome.component';
import { MainContentModule, MainContentComponent } from './main-content/main-content.component';
import { GeneralConfigComponent } from './config/general-config/general-config.component';
import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';
import { environment } from '../environments/environment';

export const appRoutes: Routes = [
  {
    path: 'news', component: MainContentComponent,
    children: [
      { path: '', redirectTo: 'digest', pathMatch: 'full' },
      { path: 'digest', component: DigestsListComponent, data: { exitOnBack: true } },
      { path: 'top', component: FeaturedComponent, data: { exitOnBack: true } },
      { path: 'search/:searchPhrase', component: SearchComponent, data: { exitOnBack: true } },
      { path: 'search/:language/:searchPhrase', component: SearchComponent, data: { exitOnBack: true } },
      { path: 'category/:id/:name', component: CategoryComponent, data: { exitOnBack: true } }
    ]
  },
  {
    path: 'config', component: ConfigComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralConfigComponent },
      { path: 'category/:id', component: CategoryConfigComponent }
    ]
  },
  {
    path: 'welcome/:continent', component: WelcomeComponent,
  },
  {
    path: 'welcome', component: WelcomeComponent,
  },
  { path: '**', redirectTo: 'news', pathMatch: 'full' },
];


/*
I am not sure to master the RouteReuseStrategy...
Anyway the current implementation only stores one rote. If the route is one of the news routes the current state is saved.
All other routes are not persisted. This ensure that navigating to config and back to any news list will persist the list state.
However navigating to one list to another will not, since only one list can be saved and the new one will overwrite the old list.
*/
export class CustomReuseStrategy implements RouteReuseStrategy {

  routesToCache: string[] = ["digest", "category/:id/:name", "search/:searchPhrase", "search/:language/:searchPhrase"];
  storedRouteHandles = new Map<string, DetachedRouteHandle>();

  calcKey(route: ActivatedRouteSnapshot) {
    let next = route;
    let url = "";
    while (next) {
      if (next.url) {
        url += next.url.join('/');
      }
      next = next.firstChild;
    }
    return url;
  }

  // Decides if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    let detach: boolean = this.routesToCache.indexOf(route.routeConfig.path) > -1;
    return detach;
  }

  //Store the information for the route we're destructing
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.clear();
    this.storedRouteHandles.set(this.calcKey(route), handle);
  }

  //Return true if we have a stored route object for the next route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(this.calcKey(route));
  }

  //If we returned true in shouldAttach(), now return the actual route data for restoration
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRouteHandles.get(this.calcKey(route));
  }

  //Reuse the route if we're going to and from the same route
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}


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
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class AppRoutingModule { }
