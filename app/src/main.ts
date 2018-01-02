import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CordovaService } from './app/cordova.service';

if (environment.production) {
  enableProdMode();
}


let onBootstrap = () => {
  console.log("[Newscron] booting app.");
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};


if (CordovaService.OnCordova) {
  document.addEventListener('deviceready', onBootstrap, false);
} else {
  onBootstrap();
}
