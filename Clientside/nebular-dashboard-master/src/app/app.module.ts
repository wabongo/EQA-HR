import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './@theme/theme.module';
import { NbDialogModule, NbIconModule, NbMenuModule, NbSidebarModule, NbToastrModule, NbWindowModule, } from '@nebular/theme';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS, metaReducers } from './@reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbTokenStorage } from '@nebular/auth';
import { JWTInterceptor } from './@interceptors/jwt.interceptor';
import { ResponseInterceptor } from './@interceptors/response.interceptor';
import { NbCustomTokenStorage } from './@core/utils.ts/customtokenstorage';
import { CoreModule } from './@core/core.module';
import { I18nModule } from './@i18n/i18n.module';
import { SmartTableComponent } from './shared/smart-table/smart-table.component';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    // SmartTableComponent,
  ],
  imports: [
    I18nModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbIconModule,
    TranslateModule.forRoot(
      {
        defaultLanguage: 'en-US',
        isolate: false,
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }
    ),
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({
      name: 'PNET CUSTOM'
    }),
    StoreRouterConnectingModule.forRoot(),
    NgbModule,
  ],

  exports: [
    // SmartTableComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true},
    {provide: APP_BASE_HREF, useValue: "/" },
    { provide: NbTokenStorage, useClass: NbCustomTokenStorage },
    { provide: LOCALE_ID, useValue: 'it-IT'},


  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
