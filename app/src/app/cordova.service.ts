import { Injectable } from '@angular/core';


function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class CordovaService {

  constructor() { }

  get cordova(): any {
    return _window().cordova;
  }

  get onCordova(): Boolean {
    return !!_window().cordova;
  }

}
