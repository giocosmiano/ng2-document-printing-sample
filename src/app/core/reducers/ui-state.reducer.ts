import {UiState} from "../app.store";
import {endsWith, startsWith} from "lodash";
import {deepObjectAssign} from "../utils/reducer.util";
import {UnsafeAction} from "./index";


export let uiInitialState = <UiState>{
  isDocumentsRetrieved: false,
  isPrintingJobInProgress: false,
};

export function uiState (state = uiInitialState, action: UnsafeAction): UiState {
    if (action.payload && !action.payload.entities) {
        let deleteIfFound = startsWith(action.type, "DELETE");
        let combineArraysIfFound = endsWith(action.type, "PAGINATE");
        return deepObjectAssign({}, deleteIfFound, combineArraysIfFound, state, action.payload);
    } else {
        return state;
    }
}
