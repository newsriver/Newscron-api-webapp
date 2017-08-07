import { Injectable } from '@angular/core';
import { CordovaService } from './cordova.service';

function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable()
export class GoogleAnalyticsService {

  constructor(public cordovaService: CordovaService) { }


  public trackEvent(category: string, action: string, label: string) {
    if (_window().ga) {
      _window().ga('send', 'event', { eventCategory: category, eventAction: action, eventLabel: label });
    }
  }

  public trackPage(name: string) {
    if (_window().ga) {
      _window().ga('send', 'pageview', name);
    }
  }

}
