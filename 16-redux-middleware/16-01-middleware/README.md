# 미들웨어란?

- 리덕스 미들웨어는 액션을 디스패치했을 때, 리듀서에서 이를 처리하기에 앞서 사전에 지정된 작업들을 실행한다. **미들웨어는 액션과 리듀서 사이의 중간자**라고 볼 수 있다.
- 리듀서가 액션을 처리하기 전에 미들웨어가 할 수 있는 작업은 여러 가지가 있다. 전달받은 액션을 단순히 콘솔에 기록하거나, 전달받은 액션 정보를 기반으로 액션을 아예 취소하거나, 다른 종류의 액션을 추가로 디스패치할 수도 있다.

## 1. 미들웨어 만들기

```tsx
import { Action, Middleware } from "redux";
import { RootStore } from "../store";

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
```

- 미들웨어 함수는 아래와 같은 형태로 이루어진다.

```tsx
const loggerMiddleware: Middleware<{}, RootStore> =
  (store) => (next) => (action: Action<any>) => {
    //(..)
  };
```

- 후에 applyMiddleware 라는 함수를 통하여 리덕스에 미들웨어를 적용하는데 이 함수에서 쓰이는 타입들은 아래와 같다.

```tsx
export function applyMiddleware<Ext1, S>(
  middleware1: Middleware<Ext1, S, any>
): StoreEnhancer<{ dispatch: Ext1 }>;
```

```tsx
export interface Middleware<
  DispatchExt = {},
  S = any,
  D extends Dispatch = Dispatch
> {
  (api: MiddlewareAPI<D, S>): (
    next: Dispatch<AnyAction>
  ) => (action: any) => any;
}
```

- 변수에 함수 객체를 넣는 경우에는 해당 변수의 타입을 지정해줄 수 있다. 그래서 첫 번째 예시의 경우에는 Middleware 타입을 정의해줄 수 있었지만, 일반함수의 경우에는 그럴 수 없기 때문에 Middleware 타입의 형식을 그대로 따라가면서 작성한다.

```tsx
export default function loggerMiddleware(store: MiddlewareAPI): any {
  return function (next: Dispatch<any>) {
    return function (action: Action<any>) {
      // (..)
    };
  };
}
```

- 이것을 왜 적었냐면, 리덕스에서 사용하는 미들웨어의 형식은 함수를 반환하는 함수를 반환하는 함수라는 것이다.
- 함수에서 파라미터로 받아오는 store는 리덕스 스토어 인스턴스를, action은 디스패치된 액션을 가리킨다.
- next 파라미터는 함수 형태이며, store.dispatch와 같은 역할을 한다. next(action)을 처리하면 그 다음 처리해야 할 미들웨어에게 액션을 넘겨주고, 만약 그 다음 미들웨어가 없다면 리듀서에게 액션을 넘겨준다는 것이다.
- 만약, 미들웨어에서 next를 사용하지 않으면, 액션이 리듀서에게 전달되지 않는다. 즉, 액션이 무시되는 것이다.

## 2. 미들웨어 적용하기

```tsx
const store = createStore(RootReducer, applyMiddleware(loggerMiddleware));
```

- redux 모듈의 applyMiddleware라는 함수를 이용한다.

![16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled.png](16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled.png)

- 미들웨어에서는 여러 종류의 작업을 처리할 수 있다. 특정 조건에 따라 액션을 무시하게 할 수도 있고, 특정 조건에 따라 액션 정보를 가로채서 변경한 후 리듀서에게 전달해줄 수도 있다. 아니면 특정 액션에 기반하여 번거로운 액션을 여러 번 디스패치할 수도 있다.
- 이러한 미들웨어 속성을 사용하여 네트워크 요청과 같은 비동기 작업을 관리하면 매우 유용하다.

## 3. redux-logger 사용하기

- 깔끔한 loggerMiddleware library

```tsx
import { createLogger } from "redux-logger";

const logger = createLogger();
const store = createStore(RootReducer, applyMiddleware(logger));
```
