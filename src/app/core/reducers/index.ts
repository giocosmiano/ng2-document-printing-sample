import {Action, ActionReducerMap} from "@ngrx/store";
import {DatabaseState, UiState} from "../app.store";
import {databaseState} from "./db-state.reducer";
import {uiState} from "./ui-state.reducer";

export interface UnsafeAction extends Action {
    payload?: any;
}

export interface State {
    databaseState: DatabaseState;
    uiState: UiState;
}

export const reducers: ActionReducerMap<State> = {
    databaseState: databaseState,
    uiState: uiState,
};
