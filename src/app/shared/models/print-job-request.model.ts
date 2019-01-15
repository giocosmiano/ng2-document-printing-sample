import {DocumentModel} from "./document.model";

export interface PrintJobDTO {
  deliverTo: String;
  instructions: Boolean;
  notes: String;
  documents: Array<DocumentModel>;
}
