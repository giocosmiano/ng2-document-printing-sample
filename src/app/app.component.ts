import {Component, Injector, OnDestroy, OnInit, ViewContainerRef} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

import * as _ from "lodash";

import {DocumentSelectors} from "./shared/models/document.model";
import {DocumentService} from "./shared/services/document.service";
import {DocumentActions} from "./shared/actions/document.actions";

@Component({
  selector: "la-solu-sample-app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Document Printing Center";
  requestedRoute: string;
  private isDocumentsRetrieved: boolean;
  private viewContainerRef: ViewContainerRef;
  private _subscriptions:Subscription[] = [];

  constructor(private _documentSelectors: DocumentSelectors,
              private _documentService: DocumentService,
              private _documentActions: DocumentActions,
              private _router: Router,
              private _injector: Injector,
              viewContainerRef: ViewContainerRef
    ) {
    this.viewContainerRef = viewContainerRef;
  }

  ngOnInit() {
    this._subscriptions.push(
      this._documentSelectors.isDocumentsRetrieved$
        .subscribe(isDocumentsRetrieved => {
          if (! isDocumentsRetrieved) {
            this._documentService.get();
          }
        })
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
