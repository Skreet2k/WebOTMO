import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  get(key: string): Object {
    const json = localStorage.getItem(key)
    return JSON.parse(json);
  }

  set(key: string, data: Object) {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json)
  }

  delete(key: string) {
    localStorage.removeItem(key)
  }
}
