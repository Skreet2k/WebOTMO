import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Flow } from '../models/flow';

@Injectable()
export class FlowService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/flow/get', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: string) {
        return this.http.get(this.config.apiUrl + '/flow/get/' + id, this.jwt()).map((response: Response) => response.json());
    }

    upload(name: string, data: string) {
        return this.http.post(this.config.apiUrl + '/flow/upload', { name: name, data: data }, this.jwt()).map((response: Response) => response.json());
    }

    update(flow: Flow) {
        return this.http.put(this.config.apiUrl + '/flow/update', flow, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}