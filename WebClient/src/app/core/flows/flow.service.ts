import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';
import { SecurityPrincipal } from '../auth/securityPrincipal';
import * as _ from 'lodash';
import { StorageService } from '../../services/storage.service';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FlowService {
    constructor(
        private readonly http: Http,
        private readonly config: AppConfig,
        private storage: StorageService) {
    }

    flowLifeMs = 60000;

    public getAll(): Promise<Flow[]> {
        let flowStorage = this.storage.get('flows') as FlowStorage;
        if (flowStorage && new Date(flowStorage.updateDate) > this.getLifeDate()) {
            return Observable.of(flowStorage.flows).toPromise();
        }
        return this.http.get(this.config.apiUrl + '/flow/get', SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
            .then((response: Response) => {
                const result = response.json();
                flowStorage = { updateDate: new Date(), flows: result };
                this.storage.set('flows', flowStorage);
                return result;
            });
    }

    public getById(id: string): Promise<Flow> {
        return this.http.get(this.config.apiUrl + `/flow/get/${id}`,
            SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
            .then((response: Response) => response.json());
    }

    public upload(name: string, data: string): Promise<any> {
        return this.http.post(this.config.apiUrl + '/flow/upload',
            { name: name, data: data },
            SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
            .then((response: Response) => response.json());
    }

    public update(flow: Flow): Promise<any> {
        return this.http.put(this.config.apiUrl + '/flow/update', flow,
            SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
            .then((response: Response) => response.json());
    }

    public remove(flow: Flow): Promise<any> {
        const id = flow.id;
        return this.http.delete(this.config.apiUrl + `/flow/delete/${id}`,
            SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise();
    }

    public validate(flow: Flow) {
        return true;
    }

    private getLifeDate(): Date {
        const date = new Date(new Date().getTime() - this.flowLifeMs);
        return date;
    }
}

export class Flow {
    id: number;
    name: string;
    data: string;
    userId?: string;
}

export class FlowStorage {
    updateDate: Date;
    flows: Array<Flow>;
}

