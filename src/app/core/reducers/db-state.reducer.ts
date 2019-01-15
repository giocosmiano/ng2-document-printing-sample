import {DatabaseState} from "../app.store";
import {endsWith, startsWith} from "lodash";
import {deepObjectAssign} from "../utils/reducer.util";
import {UnsafeAction} from "./index";

export let dbInitialState = <DatabaseState>{
  entities: {
    documents: {},
  },
};

// Updates an entity cache in response to any action with response.entities
export function databaseState (state = dbInitialState, action: UnsafeAction): DatabaseState {
  if (action.payload && action.payload.entities) {
    let deleteIfFound = startsWith(action.type, "DELETE");
    let combineArraysIfFound = endsWith(action.type, "PAGINATE");
    return deepObjectAssign({}, deleteIfFound, combineArraysIfFound, state, action.payload);
  }
  return state;
}
