import { EventEmitter } from 'events';
import Deferred from '@lenic/deferred';

export const bus = new EventEmitter();

export default function once(resetKey, callback) {
  let defer = null,
    result = null;

  const doAction = () => {
    defer = Deferred();
    result = defer.promise.then(callback);

    const errorHandler = () =>
      result.catch(e => {
        defer = Deferred();
        result = defer.promise.then(callback);

        errorHandler();

        throw e;
      });
    errorHandler();
  };

  doAction();
  if (resetKey) {
    bus.on(resetKey, doAction);
  }

  return function(...args) {
    defer.resolve(...args);

    return result;
  };
}
