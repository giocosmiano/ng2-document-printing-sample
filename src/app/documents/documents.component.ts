import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {DocumentModel, DocumentSelectors} from "../shared/models/document.model";
import {PaginationInstance} from "ngx-pagination";

import * as _ from "lodash";

@Component({
  selector: "la-document-printing",
  templateUrl: "documents.component.html",
  styleUrls: ["documents.component.scss"],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsToPrint: Array<DocumentModel> = [];
  isDisplayDocuments: boolean = false;
  isPrintingInProgress:boolean = false;
  displayPaginationControl: boolean = true;

  private _subscriptions: Subscription[] = [];

  paginationSettings: PaginationInstance = {
    id: "paginateReportStatuses",
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(private _documentSelectors: DocumentSelectors) {
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._documentSelectors.entities$()
        .subscribe(entities => {
          if (! _.isEmpty(entities)) {
            this.isDisplayDocuments = true;
            entities.forEach(entity => this.documentsToPrint.push(entity))
          }
        })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  isDocumentDisabledForPrinting(documentName: string): boolean {
    return _.endsWith(documentName, ".zip");
  }

  cancelPrinting(): void {
    this.documentsToPrint
      .forEach(doc => {
        doc.print = false;
        doc.color = false;
        doc.notes = "";
      });
  }
}
