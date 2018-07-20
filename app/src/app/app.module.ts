import 'hammerjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NewscronClientService } from './newscron-client.service';
import { CordovaService } from './cordova.service';
import { UserProfileService } from './user-profile.service';
import { LoggerService } from './logger.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [CordovaService, NewscronClientService, UserProfileService, LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
