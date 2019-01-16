import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {DocumentsComponent} from "./documents/documents.component";
import {AuthenticationGuard} from "./authentication";

const routes: Routes = [
  { path: "documentLists", component: DocumentsComponent, canActivate: [AuthenticationGuard] },
  { path: "", redirectTo: "/documentLists", pathMatch: "full" }, // home route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule { }
