import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  publicRoutes: any;

  constructor() {
    this.publicRoutes = {
      "/documentLists": true,
    };
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
    return Observable.of(true);
  }
}
