import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";

import {AppStore} from "../../core/app.store";
import {AbstractActions} from "../../core/abstract.actions";
import {DOCUMENT_MODEL_ENTITY} from "../../core/entity.constants";
import {DocumentModel} from "../models/document.model";

@Injectable()
export class DocumentActions extends AbstractActions<DocumentModel> {
  constructor(
    _store:Store<AppStore>
  ) {
    super(_store);
  }

  getEntityName():string {
    return DOCUMENT_MODEL_ENTITY;
  }

  getSelectedEntityName():string {
    return undefined;
  }

  getParentEntityName():string {
    return undefined;
  }

  dispatchSetDocumentsRetrievedAction() {
    this._store.dispatch(<Action>{
      type: `SET_${DOCUMENT_MODEL_ENTITY}_RETRIEVED`,
      payload: {
        isDocumentsRetrieved: true,
      },
    });
  }

  dispatchUnsetDocumentsRetrievedAction() {
    this._store.dispatch(<Action>{
      type: `UNSET_${DOCUMENT_MODEL_ENTITY}_RETRIEVED`,
      payload: {
        isDocumentsRetrieved: false,
      },
    });
  }

  dispatchSetPrintingJobInProgressAction() {
    this._store.dispatch(<Action>{
      type: `SET_${DOCUMENT_MODEL_ENTITY}_PRINTING_IN_PROGRESS`,
      payload: {
        isPrintingJobInProgress: true,
      },
    });
  }

  dispatchUnsetPrintingJobInProgressAction() {
    this._store.dispatch(<Action>{
      type: `UNSET_${DOCUMENT_MODEL_ENTITY}_PRINTING_IN_PROGRESS`,
      payload: {
        isPrintingJobInProgress: false,
      },
    });
  }
}
