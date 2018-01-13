import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
import { AppConfig } from '../app.config';
import { StorageService } from './storage.service';
 
@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private config: AppConfig, private storage: StorageService) { }
 
    login(email: string, password: string) {
        return this.http.post(this.config.apiUrl + '/users/authenticate', { email: email, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.storage.set('currentUser', user);
                }
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        this.storage.delete('currentUser');
    }
}