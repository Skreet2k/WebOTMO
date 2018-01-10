import { Headers, RequestOptions } from '@angular/http';

export class SecurityPrincipal {
    public static createRequestOptionsWithUserJSONWebToken(): RequestOptions {
        // create authorization header with jwt token
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            const headers = new Headers({ 
                Authorization: 'Bearer ' + currentUser.token
            });
            return new RequestOptions({ 
                headers: headers 
            });
        }
    }
}