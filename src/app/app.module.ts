import {BrowserModule, Title} from "@angular/platform-browser";
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/take";
import "rxjs/add/observable/of";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/debounceTime";

import "hammerjs";

import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {APP_SERVICES} from "./core/app-services";
import {APP_ACTIONS} from "./core/app-actions";
import {APP_SELECTORS} from "./core/app-selectors";
import {reducers} from "./core/reducers";
import {dbInitialState} from "./core/reducers/db-state.reducer";
import {uiInitialState} from "./core/reducers/ui-state.reducer";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {ToasterModule} from "angular2-toaster";
import {
  AlertModule,
  BsDropdownModule,
  DatepickerModule,
  ModalModule,
  TabsModule
} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {SelectModule} from "ng2-select";
import {DocumentsModule} from "./documents/documents.module";
import {AppAuthenticationModule} from "./authentication";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ToasterModule,
    Angular2FontawesomeModule,

    NgxPaginationModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    SelectModule,

    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forRoot(reducers, {
      initialState: {
        databaseState: dbInitialState,
        uiState: uiInitialState,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 20 }) : [],

    DocumentsModule,
    AppRoutingModule,
    AppAuthenticationModule,
  ],
  providers: [
    Title,
    APP_SERVICES,
    APP_ACTIONS,
    APP_SELECTORS,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [
    AppComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
