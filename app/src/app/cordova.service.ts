import { Injectable } from '@angular/core';


function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class CordovaService {

  private last: Date;
  constructor() {
    this.last = new Date();
  }


  get cordova(): any {
    return _window().cordova;
  }

  get onCordova(): Boolean {
    return !!_window().cordova;
  }

  public hideSplashScreen(): void {
    if (!!_window().navigator && !!_window().navigator.splashscreen) {
      _window().navigator.splashscreen.hide();
    }

  }

  public checkForUpdate(): void {
    //sync will check for update, download them and restart the app
    //allso sync will inform codePush that the app has successfully loaded, validation the update and avoiding rollbacks
    _window().codePush.sync();
  }


  public onResume(): void {


    if (this.last == null) {
      //hard-reset forces the app to completely reload
      _window().document.location.href = 'index.html';
    } else {
      let diff: number = new Date().getTime() - this.last.getTime();
      if (diff > 900000) { //15min
        //hard-reset forces the app to completely reload
        _window().document.location.href = 'index.html';
      }
    }
  }

  public openLinkInBrowser(url: string) {
    _window().SafariViewController.isAvailable(function(available) {
      if (available) {
        _window().SafariViewController.show({
          url: url,
          hidden: false, // default false
          animated: true, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
          transition: 'slide', // unless animated is false you can choose from: curl, flip, fade, slide (default)
          enterReaderModeIfAvailable: false, // default false
          barColor: "#f7f7f9", // default is white (iOS 10 only)
          tintColor: "#1ca8dd", // iOS controls colot
          controlTintColor: "#1ca8dd",  // iOS controls colot
          toolbarColor: "#f7f7f9", //android toolbar color
          showDefaultShareMenuItem: true //android sharing menu color
        });
      } else {
        _window().cordova.InAppBrowser.open(url, "_blank", "location=yes,mediaPlaybackRequiresUserAction=yes");
      }
    })
  }

}
