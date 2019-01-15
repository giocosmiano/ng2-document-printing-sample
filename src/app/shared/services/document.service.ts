import {Injectable} from "@angular/core";
import {AbstractService} from "../../core/abstract.service";
import {Http} from "@angular/http";
import {DocumentActions} from "../actions/document.actions";
import {DocumentModel, DocumentsRetrievedModel} from "../models/document.model";
import {DOCUMENTS_RETRIEVED_MODEL_ENTITY} from "../../core/entity.constants";

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

  postGet(documentsRetrievedModel: DocumentsRetrievedModel, parentId?:string) {
    if (documentsRetrievedModel) {
      let documentRetrieved: DocumentModel,
        documentsRetrieved: Array<DocumentModel> = [];
      documentsRetrievedModel.uuid = DOCUMENTS_RETRIEVED_MODEL_ENTITY;
      documentsRetrievedModel.documents["filename"]
        .forEach(doc => {
          documentRetrieved = <DocumentModel>{};
          documentRetrieved.uuid = doc;
          documentRetrieved.fileName = documentRetrieved.uuid;
          documentRetrieved.print = false;
          documentRetrieved.color = false;
          documentRetrieved.notes = "";
          documentsRetrieved.push(documentRetrieved);
        });
      super.postGet(documentsRetrieved, parentId);
    }
  }
}
