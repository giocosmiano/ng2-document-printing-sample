
export interface AppStore {
  databaseState:DatabaseState;
  uiState:UiState;
}

export interface UiState {
  isDocumentsRetrieved:boolean;
  isPrintingJobInProgress:boolean;
}

export interface DatabaseState {
  entities:{
    documents:any;
  };
}
