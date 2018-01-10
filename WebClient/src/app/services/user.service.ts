import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User } from '../models/user';
import { SecurityPrincipal } from '../core/auth/securityPrincipal';

@Injectable()
export class UserService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/users', SecurityPrincipal.createRequestOptionsWithUserJSONWebToken())
            .map((response: Response) => response.json());
    }

    getById(id: string) {
        return this.http.get(this.config.apiUrl + '/users/' + id, SecurityPrincipal.createRequestOptionsWithUserJSONWebToken())
            .map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.config.apiUrl + '/Users/Register', user, SecurityPrincipal.createRequestOptionsWithUserJSONWebToken());
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user.id, user, SecurityPrincipal.createRequestOptionsWithUserJSONWebToken());
    }

    delete(id: string) {
        return this.http.delete(this.config.apiUrl + '/users/' + id, SecurityPrincipal.createRequestOptionsWithUserJSONWebToken());
    }
}

