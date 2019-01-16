import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";

import {AppStore} from "../../core/app.store";
import {AbstractSelectors} from "../../core/abstract.selectors";

import {BaseEntity} from "../../core/base.model";
import {DOCUMENT_MODEL_ENTITY} from "../../core/entity.constants";

import * as _ from "lodash";

export interface DocumentModel extends BaseEntity {
  filename: string;
  print: boolean;
  color: boolean;
  notes: string;
}

export interface DocumentsRetrievedModel extends BaseEntity {
  documents: Array<DocumentModel>;
}

@Injectable()
export class DocumentSelectors extends AbstractSelectors<DocumentModel> {

  isDocumentsRetrieved$:Observable<boolean> = this._store.select(store => {
    return store.uiState.isDocumentsRetrieved;
  }).distinctUntilChanged(_.isEqual);

  isPrintingJobInProgress$:Observable<boolean> = this._store.select(store => {
    return store.uiState.isPrintingJobInProgress;
  }).distinctUntilChanged(_.isEqual);

  constructor(protected _store:Store<AppStore>) {
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
}
