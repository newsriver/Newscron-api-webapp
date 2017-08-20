import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';

function _window(): any {
  // return the global native browser window object
  return window;
}

export enum InstallMode {
  IMMEDIATE,
  ON_NEXT_RESTART,
  ON_NEXT_RESUME
}


@Injectable()
export class CordovaService {

  //This static methods are used by main.ts before bootsrapping the Angular app
  static get OnCordova(): Boolean {
    return !!_window().cordova;
  }

  static HideSplashScreen(): void {
    if (!!_window().navigator && !!_window().navigator.splashscreen) {
      _window().navigator.splashscreen.hide();
    }
  }

  private TIMEOUT: number = 900000; //15min

  private resume: BehaviorSubject<boolean>;
  private lastResume: Date;
  constructor(private zone: NgZone, private router: Router) {
    this.lastResume = new Date();
    this.resume = new BehaviorSubject<boolean>(null);
    //document.addEventListener('resume', this.onResume, false);
    Observable.fromEvent(document, 'resume').subscribe(event => {
      this.zone.run(() => {
        this.onResume();
      });
    })


    if (CordovaService.OnCordova) {
      Observable.fromEvent(document, 'backbutton').subscribe(event => {
        this.zone.run(() => {
          let route: ActivatedRoute = this.router.routerState.root.firstChild;
          while (route != null) {
            if (route.snapshot.data.exitOnBack != undefined && route.snapshot.data.exitOnBack == true) {
              _window().navigator.app.exitApp();
              return;
            }
            route = route.firstChild;
          }
          _window().navigator.app.backHistory()
        });
      })
    }
  }

  public resumeListener(): BehaviorSubject<boolean> {
    return this.resume;
  }


  get cordova(): any {
    return _window().cordova;
  }

  get onCordova(): Boolean {
    return CordovaService.OnCordova;
  }

  public platformName(): string {
    if (CordovaService.OnCordova) {
      return _window().device.platform;
    } else {
      return null;
    }
  }



  public checkForUpdate(): void {
    //sync will check for update, download them and restart the app
    //allso sync will inform codePush that the app has successfully loaded, validation the update and avoiding rollbacks
    _window().codePush.notifyApplicationReady();  //should not be nesecary to call as sync is doing it... but we got too many rollabks
    _window().codePush.sync(null, { installMode: InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 10 });
  }


  public onResume(): void {
    CordovaService.HideSplashScreen();

    if (this.lastResume == null) {
      //lastResume should never be null - therefor lets completely reload the app
      //hard-reset forces the app to completely reload
      _window().document.location.href = 'index.html';
    } else {
      let diff: number = new Date().getTime() - this.lastResume.getTime();
      if (diff > this.TIMEOUT) {
        this.lastResume = new Date();
        this.resume.next(true);
      }
    }
    this.checkForUpdate();
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
