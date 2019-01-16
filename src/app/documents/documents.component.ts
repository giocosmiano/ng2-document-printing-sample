import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {PaginationInstance} from "ngx-pagination";
import {DocumentModel, DocumentSelectors} from "../shared/models/document.model";
import {DocumentsToPrintDTO, PrintRequestDTO} from "../shared/models/print-job-request.model";

import * as _ from "lodash";

@Component({
  selector: "la-document-printing",
  templateUrl: "documents.component.html",
  styleUrls: ["documents.component.scss"],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsToPrint: Array<DocumentModel> = [];
  isDisplayDocuments: boolean = false;
  hasDocumentSelected: boolean = false;
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

  // put this click event callback at the end of event loop
  documentSelectUnSelect(): void {
    setTimeout(() => {
      this.hasDocumentSelected =
        this.documentsToPrint
          .filter(doc => doc.print)
          .length > 0;
    }, 50);
  }

  cancelPrinting(): void {
    this.hasDocumentSelected = false;
    this.documentsToPrint
      .forEach(doc => {
        doc.print = false;
        doc.color = false;
        doc.notes = "";
      });
  }

  submitPrinting(): void {
    let printRequestDTO: PrintRequestDTO = <PrintRequestDTO>{},
      documentsToPrintDTO: DocumentsToPrintDTO = <DocumentsToPrintDTO>{};

    documentsToPrintDTO.documents = this.documentsToPrint.filter(doc => doc.print);
    printRequestDTO.deliverTo = "";
    printRequestDTO.instructions = "";
    printRequestDTO.documents = documentsToPrintDTO;
    console.log("debugging");

    /*
          userRequestDTO.user.userPreferences = JSON.stringify(this.userPreference);
          this._userService.postUpdateUser(userRequestDTO,
            data => {
              this._toasterService.clear();
              toast = {
                type: "success",
                title: "Docket Filters",
                body: "Save request has been sent.",
                showCloseButton: false
              };
              this._toasterService.pop(toast);
            },
            error => {
              this._toasterService.clear();
              toast = {
                type: "error",
                title: "Docket Filters",
                body: "Docket filters were not saved. Try again later.",
                showCloseButton: false
              };
              this._toasterService.pop(toast);
            });
    */
  }
}
