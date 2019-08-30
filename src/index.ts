import Deferred, { DeferredResult } from "@lenic/deferred";
import EventEmitter from "eventemitter3";

interface OnceCallBack<T> {
  (...args: any[]): Promise<T> | T;
}

interface OnceResult<T> {
  (arg?: any): Promise<T>;
}

export const bus = new EventEmitter();

export default function once<T>(
  resetKey: string,
  callback: OnceCallBack<T>
): OnceResult<T> {
  let defer: DeferredResult<T> = null,
    result: Promise<T> = null;

  const doAction = () => {
    defer = Deferred<T>();
    result = defer.promise.then(callback);

    const errorHandler = () => {
      result.catch(e => {
        defer = Deferred<T>();
        result = defer.promise.then(callback);

        errorHandler();

        throw e;
      });
    };
    errorHandler();
  };

  doAction();
  if (resetKey) {
    bus.on(resetKey, doAction);
  }

  return function(arg) {
    defer.resolve(arg);

    return result;
  };
}
