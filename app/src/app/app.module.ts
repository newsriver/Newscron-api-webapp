import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { NewscronClientService } from './newscron-client.service';
import { CordovaService } from './cordova.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { UserProfileService } from './user-profile.service';
import { LoggerService } from './logger.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [CordovaService, NewscronClientService, GoogleAnalyticsService,UserProfileService,LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
