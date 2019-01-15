import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

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
}
