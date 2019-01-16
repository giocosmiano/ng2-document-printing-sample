import {DocumentModel} from "./document.model";

export interface PrintRequestDTO {
  deliverTo: string;
  instructions: string;
  documents: DocumentsToPrintDTO;
}

export interface DocumentsToPrintDTO {
  documents: Array<DocumentModel>;
}
