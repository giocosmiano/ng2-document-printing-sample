import {Action} from "@ngrx/store";
import {BaseEntity} from "./base.model";

export const ADD_ACTION_PREFIX = "ADD_";
export const CREATE_ACTION_PREFIX = "CREATE_";
export const UPDATE_ACTION_PREFIX = "UPDATE_";
export const PAGINATE_ACTION_POSTFIX = "_PAGINATE";
export const DELETE_ACTION_PREFIX = "DELETE_";
export const CLEAR_ALL_ACTION_PREFIX = "CLEAR_ALL_";
export const IN_PROGRESS = "IN_PROGRESS_";

export const SELECT_ACTION_PREFIX = "SELECT_";
export const DESELECT_ACTION_PREFIX = "DESELECT_";


export interface BaseActionCreator<T extends BaseEntity> {
  addAction(entities:Array<T>, parentId?:string):Action;
  dispatchAddAction(entities:Array<T>, parentId?:string);

  createAction(entity:T, parentId?:string):Action;
  dispatchCreateAction(entity:T, parentId?:string);

  updateAction(entity:T):Action;
  dispatchUpdateAction(entity:T);

  updateViaPaginateAction(entity:T):Action;
  dispatchUpdateViaPaginateAction(entity:T);

  deleteAction(entity:T, parentId?:string):Action;
  dispatchDeleteAction(entity:T, parentId?:string);

  deleteInProgressAction(entity:T, isDeleting:boolean, parentId?:string):Action;
  dispatchCancelDeleteInProgressAction(entity:T, parentId?:string);
  dispatchDeleteInProgressAction(entity:T, parentId?:string);

  clearAllAction():Action;
  dispatchClearAllAction();
}

export interface SelectActionCreator<T extends BaseEntity> {
  selectAction(entity:T):Action;
  dispatchSelectAction(entity:T);
  deselectAction():Action;
  dispatchDeselectAction();
}
