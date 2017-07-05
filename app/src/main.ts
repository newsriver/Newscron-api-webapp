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

let cordova: CordovaService = new CordovaService();

let onBootstrap = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
  cordova.hideSplashScreen();
};

let onResume = () => {
  cordova.onResume();
  cordova.hideSplashScreen();
};

if (cordova.onCordova) {
  document.addEventListener('deviceready', onBootstrap, false);
  document.addEventListener('resume', onResume, false);
} else {
  onBootstrap();
}
