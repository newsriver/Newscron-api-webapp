import { NgModule, OnInit, Component } from '@angular/core';
import {FeaturedComponent} from './featured/featured.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {NewscronClientService, BootstrapConfiguration, Section, CategoryPreference, Article} from './newscron-client.service';
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { CordovaService } from './cordova.service';





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
    if (this.cordovaService.onCordova) {
      this.cordovaService.checkForUpdate();
    }
  }



}
