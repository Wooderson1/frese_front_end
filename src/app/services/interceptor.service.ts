import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private uuid = uuidv4();
  constructor(private storage: Storage, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = this.addRequestId(request);
    console.log('Added ', clonedReq.headers);
    return next.handle(clonedReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const response = event as HttpResponse<any>;
          // update the uuid from the response header
          this.uuid = response.headers.get('x-request-id');
          console.log(JSON.stringify(response));
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error) {
          console.error('ERROR ', JSON.stringify(error));
        }
          return throwError(error);
        }
      ));
  }

  private addRequestId(request: HttpRequest<any>) {
    this.uuid = this.uuid ? this.uuid : uuidv4();
    return request.clone({
      headers: request.headers.set('x-request-id', this.uuid)
    });
  }
}
