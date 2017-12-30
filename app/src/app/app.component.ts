import { NgModule, OnInit, Component } from '@angular/core';
import { WelcomeComponent } from './welcome/welcome.component';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference } from './newscron-client.service';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { CordovaService } from './cordova.service';


function _window(): any {
  // return the global native browser window object
  return window;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {


  constructor(private client: NewscronClientService, public cordovaService: CordovaService) {

  }

  ngOnInit() {
    //Set full story id
    if (_window().FS) {
      _window().FS.identify(this.client.getUUID(), {});
    }

  }

}
