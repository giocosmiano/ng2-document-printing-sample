import {AppStore} from "./app.store";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {convertObjectToArray, BaseEntity} from "./base.model";

import * as _ from "lodash";

export abstract class AbstractSelectors<T extends BaseEntity> {
  protected constructor(protected _store:Store<AppStore>) {
  }

  abstract getEntityName():string;

  abstract getSelectedEntityName():string;

  getParentEntityName():string {
    return undefined;
  }

  /**
   * Subscription to all entities of T.
   *
   * @param parentId - parent.id
   */
  entities$(parentId?:string):Observable<Array<T>> {
    if (parentId) {
      return this._store.select(store => {
        let results;
        if (store.databaseState.entities[this.getParentEntityName()][parentId]) {
          let ids = store.databaseState.entities[this.getParentEntityName()][parentId][this.getEntityName()];
          if (ids && !Array.isArray(ids)) {
            ids = [ids];
          }
          results = this.getEntitiesByIds(ids, store);
        }
        return results;
      }).distinctUntilChanged(_.isEqual);
    } else {
      return this._store.select(store => {
        return store.databaseState.entities[this.getEntityName()];
      }).map(res => {
        return convertObjectToArray(res);
      });
    }
  }

  /**
   * Subscription to an entity by it's ID.
   *
   * @param id - T.id
   * @returns {Observable<T>}
   */
  entityById$(id:string):Observable<T> {
    return this._store.select(store => {
      return this.getEntityById(id, store);
    }).distinctUntilChanged(_.isEqual);
  }

  /**
   * Helper function to build up a list of entities by their ids.
   *
   * @param ids - T.id
   * @param store - store
   * @returns {Array<T>}
   */
  protected getEntitiesByIds(ids:Array<string>, store:AppStore) {
    //@todo: Why does :Array<T> not work here?
    let results;
    if (ids && store.databaseState.entities[this.getEntityName()]) {
      results = [];
      ids.forEach((id) => {
        let entity:T = this.getEntityById(id, store);
        if (entity) {
          results.push(entity);
        }
      });
    }
    return results;
  }

  protected getEntityById(id:string, store:AppStore) {
    let entity;
    if (store.databaseState.entities[this.getEntityName()]) {
      let tempEntity = store.databaseState.entities[this.getEntityName()][id];
      if (tempEntity) {
        entity = tempEntity; // TODO: make this store entity immutable
      }
    }
    return entity;
  }
}
