import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {BaseEntity} from "./base.model";
import {BaseActionCreator} from "./base.actions";
import {environment} from "../../environments/environment";

import {Router} from "@angular/router";

export const HEADER_OPTION =
  new RequestOptions({
    headers: new Headers({
      "Accept": "*/*",
      "Content-Type": "application/json",
    })
  });

export abstract class AbstractService<T extends BaseEntity> {

  router: Router;
  private ignoreList:Array<string> = ["isDeleted", "isParserDeleted", "isDeleting", "isCreating", "isFailed", "isParserOnly"];

  protected constructor(protected _http:Http,
                        protected _actionCreator?:BaseActionCreator<T>,
  ) {
  }

  abstract getRestEndpoint(params?:string):string;

  protected getEnvironment(): any {
    return environment;
  }

  /**
   * GET REST call to get T.
   *
   * Example:
   * variableService.get(); -- Gets all questions
   * variableService.get(null, framework.id) -- Gets all questions for a given framework
   * variableService.get(question.id) -- Gets question with the given id.
   *
   * @param urlString -
   * @param onSuccess - optional callback function to call if successful response
   */
  get(params?:string, onSuccess?:Function, onFailure?:Function) {
    let endpoint = this.getRestEndpoint(params);
    this._http.get(endpoint, HEADER_OPTION)
      .map((response:Response) => {
        return response.text() !== "" ? response.json() : null;
      }).subscribe(
      response => {
        this.postGet(response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      error => {
        this.handleError(error, <any>{});
      });
  }

  /**
   * This method is called after receiving the response from the store on a get call.
   *
   * @param response
   * @param parentId - Optional parent.id
   */
  postGet(response, parentId?:string) {
    if (!response) {
      response = [];
    } else if (!Array.isArray(response)) {
      //Our add actions expect an array atm, so need to make it an array of one
      //@todo should this go here or in the action itself?
      response = [response];
    }
    this._actionCreator.dispatchAddAction(<Array<T>>response, parentId);
  }

  /**
   * POST REST call to create T.
   *
   * NOTE: The id property should NOT be populated.
   *
   * Example:
   * variableService.create(question);
   *
   * @param entity - Instance of T
   * @param parentId - optional parent.id
   * @param onSuccess - optional callback function to call if successful response
   */
  create(entity:T, onSuccess?:Function, onFailure?:Function) {
    //If the entity is in the process of being persisted we just return.
    if (entity.isCreating) {
      return;
    }

    //Since the entity isn"t in the store, there is nothing to dispatch to update.
    entity.isCreating = true;

    if (entity.isFailed) {
      entity.isFailed = false;
    }

    this._http.post(this.getRestEndpoint(),
      JSON.stringify(entity, (key, value) => {
        return this.replacer(key, value);
      }),
      HEADER_OPTION)
      .map((response:Response) => response.json()).subscribe(
      response => {
        this.postCreate(<T>response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
        this.handleError(error, entity);
      }
    );
  }

  /**
   * This method is called after receiving the response from the store on a create call.
   *
   * @param entity - Instance of T
   * @param parentId - optional parent.id
   */
  postCreate(entity:T, parentId?:string) {
    this._actionCreator.dispatchCreateAction(entity, parentId);
  }

  /**
   * PUT REST call to update T.
   *
   * Example:
   * variableService.update(question);
   *
   * @param entity - Instance of T
   * @param optional onSuccess - callback function to call if the put call is successful
   */
  update(entity:T, onSuccess?:Function, onFailure?:Function) {
    if (entity.isFailed) {
      entity.isFailed = false;
    }

    this._http.put(
      this.getRestEndpoint(),
      JSON.stringify(entity, (key, value) => {
          return this.replacer(key, value);
        }
      ),
      HEADER_OPTION).map((response:Response) => response.json()).subscribe(
      response => {
        this.postUpdate(<T>response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
        this.handleError(error, entity);
      }
    );
  }

  /**
   * This method is called after receiving the response from the store on a update call.
   *
   * @param entity
   */
  postUpdate(entity:T) {
    this._actionCreator.dispatchUpdateAction(entity);
  }

  /**
   * DELETE REST call to delete T.
   *
   * Example:
   * variableService.del(question);
   *
   * @param entity - Instance of T
   * @param parentId - optional parent.id
   * @param parentIdToStore - optional parent.id
   * @param onSuccess - optional callback function to call if successful response
   */
  del(entity:T, parentId?:string, parentIdToStore?:string, onSuccess?:Function, onFailure?:Function) {
    if (entity.isFailed) {
      entity.isFailed = false;
    }

    // TODO: temporarily disabled
    // this._actionCreator.dispatchDeleteInProgressAction(entity, parentIdToStore);
    let endpoint: string = `${this.getRestEndpoint()}?path=${encodeURIComponent(entity["path"])}`;

    //TODO: Talked with authoring-service developer said we might need framework for delete.
    this._http.delete(endpoint, HEADER_OPTION).subscribe(
      response => {
        this.postDelete(entity, parentIdToStore);
        if (onSuccess) {
          onSuccess(entity);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
        this.handleError(error, entity, parentIdToStore);
      }
    );
  }

  /**
   * This method is called after receiving the response from the store on a delete call.
   *
   * @param entity
   * @param parentIdToStore - optional parent.id
   */
  postDelete(entity:T, parentIdToStore?:string) {
    this._actionCreator.dispatchDeleteAction(entity, parentIdToStore);
  }

  /**
   * Add a new property of an entity to be ignored via <code>replacer</code>
   *
   * @param propertiesToIgnore - T.property to add to ignore list
   */
  addToIgnoreList(...propertiesToIgnore) {
    this.ignoreList.push(...propertiesToIgnore);
  }

  /**
   * Ignore properties on the entity that are not allowed by the REST Endpoint. <code>addToIgnoreList</code> to add
   * to the ignore list.
   *
   * @param key - T.property
   * @param value - value of T.property
   * @returns {any}
   */
  protected replacer(key, value) {
    if (this.ignoreList.indexOf(key) !== -1) {
      return undefined;
    } else {
      return value;
    }
  }

  protected handleError(error:any, entity?:T, parentId?:string) {

    let errorBody: any,
      errorMessage: string = "",
      stackTraceMessage: string = "";

    if (entity && entity.isDeleting) {
      this._actionCreator.dispatchCancelDeleteInProgressAction(entity, parentId);
    }

    // this._alertsService.showError(error.text());
    if (entity) {
      entity.isFailed = true;
      if (entity.isCreating) {
        entity.isCreating = false;
      }
    }
  }
}
