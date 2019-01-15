import {Action, Store} from "@ngrx/store";
import {normalize, Schema, arrayOf} from "normalizr";
import {AppStore} from "./app.store";
import {BaseEntity} from "./base.model";
import {
  BaseActionCreator,
  SelectActionCreator,
  SELECT_ACTION_PREFIX,
  ADD_ACTION_PREFIX,
  CREATE_ACTION_PREFIX,
  UPDATE_ACTION_PREFIX,
  DELETE_ACTION_PREFIX,
  DESELECT_ACTION_PREFIX,
  IN_PROGRESS,
  PAGINATE_ACTION_POSTFIX,
  CLEAR_ALL_ACTION_PREFIX,
} from "./base.actions";
import {useEntityPathAsUUID} from "./entity.constants";

export abstract class AbstractActions<T extends BaseEntity> implements BaseActionCreator<T>, SelectActionCreator<T> {
  entitySchema:Schema;

  ADD_ACTION = `${ADD_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  CREATE_ACTION = `${CREATE_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  UPDATE_ACTION = `${UPDATE_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  UPDATE_VIA_PAGINATE_ACTION = `${UPDATE_ACTION_PREFIX}${this.getEntityName().toUpperCase()}${PAGINATE_ACTION_POSTFIX}`;
  DELETE_ACTION = `${DELETE_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  DELETE_IN_PROGRESS_ACTION = `${DELETE_ACTION_PREFIX}${IN_PROGRESS}${this.getEntityName().toUpperCase()}`;
  CLEAR_ALL_ACTION = `${CLEAR_ALL_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  SELECT_ACTION = `${SELECT_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;
  DESELECT_ACTION = `${DESELECT_ACTION_PREFIX}${this.getEntityName().toUpperCase()}`;

  constructor(
    protected _store:Store<AppStore>
  ) {
  }

  /**
   * Abstract function to get the entity name. The entity name should match what is in the reducer and app.store.
   *
   * ex.
   * getEntityName():string {
     *     return "frameworks"
     * }
   *
   * @return {string}
   */
  abstract getEntityName():string;

  /**
   * Abstract function to get the selected entity name. The selected entity name should match what is in the reducer
   * and app.store.
   *
   * ex.
   * getSelectedEntityName():string {
     *     return "selectedFramework";
     * }
   *
   * @return {string}
   */
  abstract getSelectedEntityName():string;

  /**
   * Abstract function to get the parent entity name. The parent entity name should match what is in the reducer and
   * app.store.
   *
   * ex.
   * getParentEntityName():string {
     *     return "frameworks";
     * }
   *
   * @return {string}
   */
  abstract getParentEntityName():string;

  /**
   * Helper function to build the schema used for normalizing. By default it uses the entity name from getEntityName
   * to create the schema. Override if this is not the desired schema.
   *
   * ex.
   * protected buildSchema():Schema {
     *    return new Schema("variables").define({
     *           answers: arrayOf(new Schema("answers"))
     *    });
     * }
   *
   * @returns {Normalizr.Schema}
   */
  protected buildSchema():Schema {
    return new Schema(this.getEntityName(), { idAttribute: "uuid" });
  }

  protected buildNewSchema(entityName: string):Schema {
    return new Schema(entityName, { idAttribute: "uuid" });
  }

  /**
   * Helper function used by actions.
   * @returns {Schema}
   */
  protected getSchema():Schema {
    if (!this.entitySchema) {
      this.entitySchema = this.buildSchema();
    }

    return this.entitySchema;
  }

  /**
   * Helper function to build the payload for the action.
   *
   * @param normalized - normalized object
   * @param parentId - parent.id
   * @returns {Object}
   */
  protected buildPayload(normalized, parentId?:string) {
    let result = normalized.result;
    delete normalized.result;

    if (parentId) {
      normalized.entities[this.getParentEntityName()] = {
        [parentId]: {
          [this.getEntityName()]: result,
        },
      };
    } else if (normalized.entities[this.getEntityName()]) {
      normalized.entities[this.getEntityName()].result = result;
    }

    return normalized;
  }


  /**
   * For special logic of building up entities call super and pass in the new list of entities.
   *
   * @param entities - T
   * @param parentId - parent.id
   * @returns {Action}
   */
  addAction(entities:Array<T>, parentId?:string):Action {

    // we initially used the uuid as identifier for `normalizr` but as it turns out
    // CMWell is changing the uuid after an update on any of its properties so
    // let's use the URI (or path) of the entity as uuid
    // because it is the true identifier of the entity
    if (entities && entities.length > 0) {
      entities.forEach(entity => {
        useEntityPathAsUUID(entity);
      });
    }

    let normalized = normalize(entities, arrayOf(this.getSchema()));
    if (!Array.isArray(normalized.result)) {
      // if there is only one result it is a string not an array which causes an error later on trying to do
      // forEach on the ids
      normalized.result = [normalized.result];
    } else if (!normalized.result) {
      normalized.result = [];
    }
    let payload = this.buildPayload(normalized, parentId);
    return <Action>{
      type: this.ADD_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch the add action
   *
   * @param entities - T
   * @param parentId - parent.id
   */
  dispatchAddAction(entities:Array<T>, parentId?:string) {
    this._store.dispatch(this.addAction(entities, parentId));
  }


  /**
   * Create Action
   *
   * @param entity - T
   * @param parentId - parent.id
   * @returns {Action}
   */
  createAction(entity:T, parentId?:string):Action {

    // we initially used the uuid as identifier for `normalizr` but as it turns out
    // CMWell is changing the uuid after an update on any of its properties so
    // let's use the URI (or path) of the entity as uuid
    // because it is the true identifier of the entity
    if (entity) {
      useEntityPathAsUUID(entity);
    }

    let normalized = normalize(entity, this.getSchema());
    let payload = this.buildPayload(normalized, parentId);
    return <Action>{
      type: this.CREATE_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch the Create Action
   *
   * @param entity - T
   * @param parentId - parent.id
   */
  dispatchCreateAction(entity:T, parentId?:string) {
    let currentState: AppStore;
    this._store.take(1).subscribe((s) => currentState = s);

    if (currentState.databaseState.entities[this.getEntityName()] &&
      !currentState.databaseState.entities[this.getEntityName()][entity.id]) {
      //if the entity isn't already in the store then dispatch the create action
      return this._store.dispatch((this.createAction(entity, parentId)));
    }
  }

  /**
   * Update Action
   *
   * @param entity - T
   * @returns {Action}
   */
  updateAction(entity:T):Action {

    // we initially used the uuid as identifier for `normalizr` but as it turns out
    // CMWell is changing the uuid after an update on any of its properties so
    // let's use the URI (or path) of the entity as uuid
    // because it is the true identifier of the entity
    if (entity) {
      useEntityPathAsUUID(entity);
    }

    let normalized = normalize(entity, this.getSchema());
    let payload = this.buildPayload(normalized, null);

    return <Action>{
      type: this.UPDATE_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch Update Action
   *
   * @param entity - T
   */
  dispatchUpdateAction(entity:T) {
    return this._store.dispatch(this.updateAction(entity));
  }

  /**
   * Update Action
   *
   * @param entity - T
   * @returns {Action}
   */
  updateViaPaginateAction(entity:T):Action {
    let normalized = normalize(entity, this.getSchema());
    let payload = this.buildPayload(normalized, null);

    return <Action>{
      type: this.UPDATE_VIA_PAGINATE_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch Update Action
   *
   * @param entity - T
   */
  dispatchUpdateViaPaginateAction(entity:T) {
    return this._store.dispatch(this.updateViaPaginateAction(entity));
  }

  /**
   * Delete Action
   *
   * @param entity - T
   * @param parentId - parent.id
   * @returns {Action}
   */
  deleteAction(entity:T, parentId?:string):Action {

    // we initially used the uuid as identifier for `normalizr` but as it turns out
    // CMWell is changing the uuid after an update on any of its properties so
    // let's use the URI (or path) of the entity as uuid
    // because it is the true identifier of the entity
    if (entity) {
      useEntityPathAsUUID(entity);
    }

    entity.isDeleted = true;
    let normalized = normalize(entity, this.getSchema());
    let payload = this.buildPayload(normalized, parentId);

    return <Action>{
      type: this.DELETE_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch Delete Action
   *
   * @param entity - T
   * @param parentId - parent.id
   */
  dispatchDeleteAction(entity:T, parentId?:string) {
    return this._store.dispatch(this.deleteAction(entity, parentId));
  }

  /**
   * Delete Action
   *
   * @param entity - T
   * @param isDeleting - flag for isDeleting
   * @param parentId - parent.id
   * @returns {Action}
   */
  deleteInProgressAction(entity:T, isDeleting:boolean, parentId?:string):Action {
    entity.isDeleting = isDeleting;
    let normalized = normalize({id:entity.id, isDeleting:isDeleting}, this.getSchema());
    let payload = this.buildPayload(normalized, parentId);

    return <Action>{
      type: this.DELETE_IN_PROGRESS_ACTION,
      payload: payload,
    };
  }

  /**
   * Dispatch Delete In Progress Action
   *
   * @param entity - T
   * @param parentId - parent.id
   */
  dispatchDeleteInProgressAction(entity:T, parentId?:string) {
    return this._store.dispatch(this.deleteInProgressAction(entity, true, parentId));
  }

  /**
   * Dispatch Cancel Delete In Progress Action
   *
   * @param entity - T
   * @param parentId - parent.id
   */
  dispatchCancelDeleteInProgressAction(entity:T, parentId?:string) {
    return this._store.dispatch(this.deleteInProgressAction(entity, false, parentId));
  }

  clearAllAction() {
    return <Action>{
      type: this.CLEAR_ALL_ACTION,
      payload: {
        entities: {
          [this.getEntityName()]: {},
        },
      },
    };
  }

  dispatchClearAllAction() {
    return this._store.dispatch(this.clearAllAction());
  }

  /**
   * Select Action
   *
   * @param entity - T
   * @returns {Action}
   */
  selectAction(entity:T):Action {
    return <Action>{
      type: this.SELECT_ACTION,
      payload: {
        [this.getSelectedEntityName()]: entity.id,
      },
    };
  }

  /**
   * Dispatch Select Action
   *
   * @param entity - T
   */
  dispatchSelectAction(entity:T) {
    this._store.dispatch(this.selectAction(entity));
  }

  /**
   * Deselect Action
   *
   * @returns {Action}
   */
  deselectAction():Action {
    return <Action>{
      type: this.DESELECT_ACTION,
      payload: {
        [this.getSelectedEntityName()]: null,
      },
    };
  }

  /**
   * Dispatch Deselect Action
   */
  dispatchDeselectAction() {
    this._store.dispatch(this.deselectAction());
  }
}
