import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApiModule } from './api.module';
import { BASE_PATH } from './variables';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './main/tree/tree.component';
import { DataAdapter } from './adapters/data-adapter';
import { HomeComponent } from './main/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    HttpClientModule
  ],
  providers: [
    DataAdapter,
    {
    provide: BASE_PATH,
    useValue: environment.webApiUrl,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
