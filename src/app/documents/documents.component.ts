import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {PaginationInstance} from "ngx-pagination";
import {DocumentModel, DocumentSelectors} from "../shared/models/document.model";
import {DocumentsToPrintDTO, PrintRequestDTO} from "../shared/models/print-job-request.model";
import {DocumentService} from "../shared/services/document.service";
import {Toast, ToasterService} from "angular2-toaster";

import * as _ from "lodash";

@Component({
  selector: "gio-document-printing",
  templateUrl: "documents.component.html",
  styleUrls: ["documents.component.scss"],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsToPrint: Array<DocumentModel> = [];
  isDisplayDocuments: boolean = false;
  hasDocumentSelected: boolean = false;
  isPrintingInProgress:boolean = false;
  displayPaginationControl: boolean = true;
  itemsPerPage: number = 50;
  MAX_ENTRIES_PER_PAGE: number = 50;
  DEFAULT_ENTRIES_PER_PAGE: number = 50;
  userComments: string = "";
  userCommentsNotes: string = "If you have any specific instructions pertinent to your entire order, please enter them here...";

  deliverToMeetingOwner: string = "Meeting Owner";
  deliverToMeetingRoom: string = "Meeting Room";
  deliverToMeetingOwnerText: string = `${this.deliverToMeetingOwner} - Delivery will occur one business day prior to the meeting time.`;
  deliverToMeetingRoomText: string = `${this.deliverToMeetingRoom} - Delivery will occur 15 minutes prior to the meeting time.`;
  deliveryToOption: string = this.deliverToMeetingOwner;

  private _subscriptions: Subscription[] = [];

  paginationSettings: PaginationInstance = {
    id: "paginateReportStatuses",
    itemsPerPage: this.itemsPerPage,
    currentPage: 1,
  };

  constructor(private _documentSelectors: DocumentSelectors,
              private _documentService: DocumentService,
              private _toasterService: ToasterService) {
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

  onPageChange(page: number) {
    setTimeout(() => {
      this.paginationSettings.currentPage = page;
    }, 50);
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
    let toast: Toast;
    this._documentService.cancelPrinting(
      data => {
        let bodyMsg = "",
          printJobId = data["printJobId"];
        if (_.has(data, "msg")) {
          bodyMsg = data["msg"];
        } else {
          bodyMsg = `Printing has been cancelled with confirmation # ${printJobId}`;
        }
        this._toasterService.clear();
        toast = {
          type: "success",
          title: "Document Printing",
          body: bodyMsg,
          showCloseButton: false
        };
        this._toasterService.pop(toast);
      },
      error => {
        this._toasterService.clear();
        toast = {
          type: "error",
          title: "Document Printing",
          body: "Documents printing cancellation request has failed. Try again later.",
          showCloseButton: false
        };
        this._toasterService.pop(toast);
      });
  }

  submitPrinting(): void {
    this.isPrintingInProgress = true;
    let toast: Toast,
      printRequestDTO: PrintRequestDTO = <PrintRequestDTO>{},
      documentsToPrintDTO: DocumentsToPrintDTO = <DocumentsToPrintDTO>{};

    documentsToPrintDTO.documents = this.documentsToPrint.filter(doc => doc.print);
    printRequestDTO.deliverTo = "";
    printRequestDTO.instructions = "";
    printRequestDTO.documents = documentsToPrintDTO;
    console.log("debugging");

    this._documentService.submitPrinting(printRequestDTO,
      data => {
        this.isPrintingInProgress = false;
        this._toasterService.clear();
        toast = {
          type: "success",
          title: "Document Printing",
          body: `Printing documents with confirmation # ${data["requestConfirmation"]["printJobId"]}`,
          showCloseButton: false
        };
        this._toasterService.pop(toast);
      },
      error => {
        this.isPrintingInProgress = false;
        this._toasterService.clear();
        toast = {
          type: "error",
          title: "Document Printing",
          body: "Printing documents request has failed. Try again later.",
          showCloseButton: false
        };
        this._toasterService.pop(toast);
      });
  }
}
