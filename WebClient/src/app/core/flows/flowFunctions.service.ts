import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AppConfig } from '../../app.config';
import { Flow } from './flow.service';
import { SecurityPrincipal } from '../auth/securityPrincipal';
import * as _ from "lodash";

@Injectable()
export class FlowFunctionsService {
    constructor(
        private readonly http: Http,
        private readonly config: AppConfig) {
    }

    public getAll(): Promise<FunctionDisplayItem[]> {
        return this.http.get(this.config.apiUrl + '/function/get', SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
            .then((response: Response) => response.json());
    }

    public processFunction(args: ProcessFunctionRequestArgs): Promise<number[]> {
        return this.http.post(this.config.apiUrl + '/function/processFunction',
            args,
            SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
        .then((response: Response) => response.json());
    }
}

export class FunctionDisplayItem {
    public id: number;
    public name: string;
    public description: string;
    public deltaX: number;
    public isNeedMaxLoadFactor: boolean;
}

export class ProcessFunctionRequestArgs {
    public id: number;
    public flowId: number;
    public numberOfServiceUnits?: number;
    public loadFactor?: number;
}
