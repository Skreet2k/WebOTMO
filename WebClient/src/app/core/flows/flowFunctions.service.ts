import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';
import { Flow } from './flow.service';
import { SecurityPrincipal } from '../auth/securityPrincipal';
import * as _ from 'lodash';
import { StorageService } from '../../services/storage.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router/';


@Injectable()
export class FlowFunctionsService {
  constructor(
    private readonly http: Http,
    private readonly config: AppConfig,
    private storage: StorageService,
    private router: Router) {
  }

  functionLifeMs = 600000;

  public getAll(): Promise<FunctionDisplayItem[]> {
    let functionStorage = this.storage.get('functions') as FunctionDisplayStorage;
    if (functionStorage && new Date(functionStorage.updateDate) > this.getLifeDate()) {
      return Observable.of(functionStorage.functions).toPromise();
    }
    return this.http.get(this.config.apiUrl + '/function/get', SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
      .then((response: Response) => {
        const result = response.json();
        functionStorage = { updateDate: new Date(), functions: result };
        this.storage.set('functions', functionStorage);
        return result;
      }).catch(error => this.router.navigate(['/login']));
  }

  public processFunction(args: ProcessFunctionRequestArgs): Promise<number[]> {
    return this.http.post(this.config.apiUrl + '/function/processFunction',
      args,
      SecurityPrincipal.createRequestOptionsWithUserJSONWebToken()).toPromise()
      .then((response: Response) => response.json()).catch(error => this.router.navigate(['/login']));;
  }

  private getLifeDate(): Date {
    const date = new Date(new Date().getTime() - this.functionLifeMs);
    return date;
  }
}

export class FunctionDisplayItem {
  public id: number;
  public name: string;
  public description: string;
  public deltaX: number;
  public isNeedMaxLoadFactor: boolean;
}

export class FunctionDisplayStorage {
  updateDate: Date;
  functions: Array<FunctionDisplayItem>;
}

export class ProcessFunctionRequestArgs {
  public id: number;
  public flowId: number;
  public numberOfServiceUnits?: number;
  public loadFactor?: number;
  public maxLoadFactor?: number;
}
