import {Injectable} from "@angular/core";
import {AbstractService, HEADER_OPTION} from "../../core/abstract.service";
import {Http, Response} from "@angular/http";
import {DocumentActions} from "../actions/document.actions";
import {DocumentModel, DocumentsRetrievedModel} from "../models/document.model";
import {DOCUMENTS_RETRIEVED_MODEL_ENTITY} from "../../core/entity.constants";
import {PrintRequestDTO} from "../models/print-job-request.model";

@Injectable()
export class DocumentService extends AbstractService<DocumentModel> {

  constructor(protected http: Http,
              protected actionCreator: DocumentActions) {
    super(http, actionCreator);
  }

  getRestEndpoint(params?: string): string {
    let environment = this.getEnvironment();
    return `${environment.baseURL}${environment.documentsEndpoint}`;
  }

  postRestEndpoint(params?: string): string {
    let environment = this.getEnvironment();
    return `${environment.baseURL}${environment.printJobsEndpoint}`;
  }

  postGet(documentsRetrievedModel: DocumentsRetrievedModel, parentId?:string) {
    if (documentsRetrievedModel) {
      let documentRetrieved: DocumentModel,
        documentsRetrieved: Array<DocumentModel> = [];
      documentsRetrievedModel.uuid = DOCUMENTS_RETRIEVED_MODEL_ENTITY;
      documentsRetrievedModel.documents["filename"]
        .forEach(doc => {
          documentRetrieved = <DocumentModel>{};
          documentRetrieved.uuid = doc;
          documentRetrieved.filename = documentRetrieved.uuid;
          documentRetrieved.print = false;
          documentRetrieved.color = false;
          documentRetrieved.notes = "";
          documentsRetrieved.push(documentRetrieved);
        });
      super.postGet(documentsRetrieved, parentId);
    }
  }

  submitPrinting(printRequestDTO: PrintRequestDTO, onSuccess?:Function, onFailure?:Function) {
    let endpoint = this.postRestEndpoint();
    this._http.put(endpoint,
      printRequestDTO,
      HEADER_OPTION)
      .map((response:Response) => response.json()).subscribe(
      response => {
        if (onSuccess) {
          onSuccess(response);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
      }
    );
  }

  cancelPrinting(onSuccess?:Function, onFailure?:Function) {
    let endpoint = this.postRestEndpoint();
    this._http.delete(endpoint,
      HEADER_OPTION)
      .map((response:Response) => response.json()).subscribe(
      response => {
        if (onSuccess) {
          onSuccess(response);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
      }
    );
  }
}
