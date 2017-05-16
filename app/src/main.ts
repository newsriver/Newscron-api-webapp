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
};

let onResume = () => {
  cordova.onResume();
};

if (cordova.onCordova) {
  //alert('cordova');
  document.addEventListener('deviceready', onBootstrap, false);
  document.addEventListener('resume', onResume, false);
} else {
  onBootstrap();
}
