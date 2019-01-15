import { NgModule, Injector } from "@angular/core";
import {HttpModule, RequestOptions, XHRBackend, Http, BrowserXhr, JsonpModule} from "@angular/http";
import { AuthenticationBrowserXHR } from "./authentication-browser-xhr";
import { AuthenticationHttp } from "./authentication-http";
import { AuthenticationGuard} from "./authentication-guard";
import {ToasterService} from "angular2-toaster";

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, injector: Injector, toasterService: ToasterService) {
  return new AuthenticationHttp(backend, defaultOptions, injector, toasterService);
}

@NgModule({
  imports: [
    HttpModule,
    JsonpModule,
  ],
  declarations: [
  ],
  exports: [
    HttpModule,
    JsonpModule,
  ],
  providers: [
    AuthenticationGuard,
    {provide: BrowserXhr, useClass: AuthenticationBrowserXHR},
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Injector, ToasterService],
    },
  ],
})
export class SoluAuthenticationModule { }
