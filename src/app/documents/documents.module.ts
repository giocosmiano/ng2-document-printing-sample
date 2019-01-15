import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NgxPaginationModule} from "ngx-pagination";
import {Angular2FontawesomeModule} from "angular2-fontawesome";
import {SelectModule} from "ng2-select";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {DocumentsComponent} from "./documents.component";
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatRadioModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,

    NgxPaginationModule,
    Angular2FontawesomeModule,
    BsDropdownModule,
    ModalModule,
    SelectModule,
  ],
  declarations: [
    DocumentsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentsModule {
}
