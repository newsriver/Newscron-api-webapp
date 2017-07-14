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
      if (diff > 300000) {
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
          transition: 'curl', // unless animated is false you can choose from: curl, flip, fade, slide (default)
          enterReaderModeIfAvailable: false, // default false
          barColor: "#0000ff", // default is white (iOS 10 only)
          tintColor: "#ffffff" // default is ios blue
        });
      } else {
        _window().cordova.InAppBrowser.open(url, "_blank", "location=no,mediaPlaybackRequiresUserAction=yes");
      }
    })
  }

}
