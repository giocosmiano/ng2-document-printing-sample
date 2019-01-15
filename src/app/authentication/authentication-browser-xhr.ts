import {Injectable} from "@angular/core";
import {BrowserXhr} from "@angular/http";

@Injectable()
export class AuthenticationBrowserXHR extends BrowserXhr {
    build(): any {
        let xhr:any = super.build();
        xhr.withCredentials = false;
        return xhr;
    }
}
