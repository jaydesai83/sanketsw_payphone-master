import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {AppComponent} from './app.component';
import {APP_ROUTER_PROVIDERS} from './app.routes';
import {enableProdMode} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/Rx';
import { BrowserXhr } from '@angular/http';
import {CustExtBrowserXhr} from './cust-ext-browser-xhr';

declare var ENV: string;

if (ENV === 'production') {
  enableProdMode();
}

// enableProdMode();
bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(BrowserXhr, { useClass: CustExtBrowserXhr })
]);
