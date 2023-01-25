import { Injectable } from '@nestjs/common';
import clsHooked from 'cls-hooked';
import EventEmitter = NodeJS.EventEmitter;

@Injectable()
export class ClsService {
  private namespace: clsHooked.Namespace;

  constructor() {
    this.namespace = clsHooked.createNamespace('session');
  }

  public set<T = any>(key: string, value: T) {
    this.namespace.set(key, value);
  }

  public get<T = any>(key: string): T {
    return this.namespace.get(key);
  }

  public run(cb: (...args: any[]) => void): any {
    return this.namespace.runAndReturn<any>(cb);
  }

  public bindEmitter(emitter: EventEmitter) {
    this.namespace.bindEmitter(emitter);
  }
}
