import './polyfills.ts';

import 'rxjs/add/operator/map'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';
import { CordovaService } from './app/cordova.service';



if (environment.production) {
  enableProdMode();
}

let onBootstrap = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
  CordovaService.HideSplashScreen();
};


if (CordovaService.OnCordova) {
  document.addEventListener('deviceready', onBootstrap, false);
} else {
  onBootstrap();
}
