import {Injectable, Injector} from "@angular/core";
import {Http, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {ToasterService} from "angular2-toaster";

@Injectable()
export class AuthenticationHttp extends Http {

    constructor(backend: XHRBackend,
                defaultOptions: RequestOptions,
                private injector: Injector,
                private toasterService: ToasterService) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.create(observer => {
            super.get(url, options).subscribe(
                (successfulResult) => {
                    // successful response, no extra actions necessary
                    observer.next(successfulResult);
                },
                (errorResult) => {
                    this.interceptResponse(errorResult);
                    //call complete if you want to close this stream (like a promise)
                    observer.error(errorResult);
                }
            );
        });
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.create(observer => {
            super.post(url, body, options).subscribe(
                (successfulResult) => {
                    // successful response, no extra actions necessary
                    observer.next(successfulResult);
                },
                (errorResult) => {
                    this.interceptResponse(errorResult);
                    //call complete if you want to close this stream (like a promise)
                    observer.error(errorResult);
                }
            );
        });
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.create(observer => {
            super.put(url, body, options).subscribe(
                (successfulResult) => {
                    // successful response, no extra actions necessary
                    observer.next(successfulResult);
                },
                (errorResult) => {
                    this.interceptResponse(errorResult);
                    //call complete if you want to close this stream (like a promise)
                    observer.error(errorResult);
                }
            );
        });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.create(observer => {
            super.delete(url, options).subscribe(
                (successfulResult) => {
                    // successful response, no extra actions necessary
                    observer.next(successfulResult);
                },
                (errorResult) => {
                    this.interceptResponse(errorResult);
                    //call complete if you want to close this stream (like a promise)
                    observer.error(errorResult);
                }
            );
        });
    }

    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return Observable.create(observer => {
            super.patch(url, body, options).subscribe(
                (successfulResult) => {
                    // successful response, no extra actions necessary
                    observer.next(successfulResult);
                },
                (errorResult) => {
                    this.interceptResponse(errorResult);
                    //call complete if you want to close this stream (like a promise)
                    observer.error(errorResult);
                }
            );
        });
    }

    interceptResponse(response: Response) {
        if (response.status === 401) {
            localStorage.removeItem(environment.authenticationToken);
            let toast = {
              type: "error",
              title: "Login Expired",
              body: "Your SAFE login has expired. Please refresh the page or log out.",
              showCloseButton: false,
              timeout: 0
            };
            setTimeout(() => {
              this.toasterService.clear();
              this.toasterService.pop(toast);
            }, 10); // put at the end of queue in the event loop
        }
    }
}
