import { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { RootStore } from "../store";

/*
const loggerMiddleware: Middleware<{}, RootStore> =
  (store) => (next) => (action: Action<any>) => {
    console.group(action && action.type);
    console.log("이전 상태", store.getState());
    console.log("액션", action);
    next(action);
    console.log("다음 상태", store.getState());
    console.groupEnd();
  };

export default loggerMiddleware;
*/

export default (function (): Middleware {
  return function (store: MiddlewareAPI) {
    return function (next: Dispatch) {
      return function (action: Action<any>) {
        console.group(action && action.type);
        console.log("이전 상태", store.getState());
        console.log("액션", action);
        next(action);
        console.log("다음 상태", store.getState());
        console.groupEnd();
      };
    };
  };
})();
