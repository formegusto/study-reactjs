# Redux-Saga

- Redux-Saga 는 비동기 작업을 처리하는데에 좀 더 까다로운 상황에서 유용하다.

  1. 기존 요청을 취소 처리해야 할 때 (불필요한 중복 요청 방지)
  2. 특정 액션이 발생했을 때, 다른 액션을 발생시키거나, API 요청 등 리덕스와 관계없는 코드를 실행할 때
  3. 웹 소켓을 사용할 때
  4. API 요청 실패 시 재요청해야 할 때

  → 이것들은 Redux-Saga가 Generator 기반으로 동작하기 때문에 가능하다.

## 1. 제너레이터 함수 이해하기

- ES6에서 추가된 제너레이터(generator) 함수는 MDN 문서에서 다음과 같이 설명된다.

  Generator는 **빠져나갔다가 나중에 다시 돌아올 수 있는 함수**입니다. 이때 **컨텍스트(변수 값)는 출입 과정에서 저장된 상태**로 남아 있습니다.

  Generator 함수는 **호출되어도 즉시 실행되지 않고**, **대신 함수를 위한 [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator) 객체가 반환**됩니다. Iterator의 `next()` 메서드를 호출하면 Generator 함수가 실행되어 **`[yield](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/yield)`** 문을 만날 때까지 진행하고, 해당 표현식이 명시하는 Iterator로부터의 반환값을 반환합니다. **`[yield*](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/yield*)`** 표현식을 마주칠 경우, 다른 Generator 함수가 위임(delegate)되어 진행됩니다.

  이후 `next()` 메서드가 호출되면 진행이 멈췄던 위치에서부터 재실행합니다. `next()` 가 반환하는 객체는 `yield`문이 반환할 값(yielded value)을 나타내는 `value` 속성과, Generator 함수 안의 모든 `yield` 문의 실행 여부를 표시하는 boolean 타입의 `done` 속성을 갖습니다. `next()` 를 인자값과 함께 호출할 경우, 진행을 멈췄던 위치의 `yield` 문을  `next()` 메서드에서 받은 인자값으로 치환하고 그 위치에서 다시 실행하게 됩니다.

> 핵심은 함수를 작성할 때, 함수를 특정 구간에 멈춰 놓을 수도 있고, 원할 때 다시 돌아가게 할 수도 있다는 것

```tsx
function weirdFunction() {
  return 1;
  return 2;
  return 3;
  return 4;
  return 5;
}
```

- 다음과 같이 일반 함수에서 값을 여러개 반환하는 것은 불가능하다. 일반 함수에서 return 키워드를 만나는 순간 그 함수는 종료되어 뒤에 따라오는 코드들은 무시된다.

```tsx
function* generatorFunction() {
  console.log("안녕하세요");
  yield 1;
  console.log("제너레이터 함수");
  yield 2;
  console.log("function");
  yield 3;
  return 4;
}
```

- 하지만 제너레이터 함수를 사용하면 함수에서 값을 순차적으로 반환할 수 있다. 심지어 함수의 흐름을 도중에 멈춰 놓았다가 다시 이어서 진행시킬 수도 있다.

> Generator 함수는 호출되어도 즉시 실행되지 않고, 함수를 위한 Iterator 객체가 반환

```tsx
function* generatorFunction() {
  console.log("안녕하세요");
  yield 1;
  console.log("제너레이터 함수");
  yield 2;
  console.log("function");
  yield 3;
  return 4;
}

const generator = generatorFunction();

Object.getOwnPropertyDescriptors({ generator }, "generator");
/*
	{
		value: generatorFunction, 
		writable: true, 
		enumerable: true, 
		configurable: true
	}
*/

console.log(Symbol.iterator in generator);
/*
	true
*/

generator.next();
/*
	안녕하세요
	{value: 1, done: false}
*/
```

- 제너레이터 함수가 반환하는 객체는 enumerable: true, Symbol.iterator프로퍼티의 존재여부, next 함수의 존재여부 즉, 이터레이터이다.

```tsx
const genRes = [...generator];
console.log(genRes);
// [1,2,3];
```

- for(...of...) 혹은 스프레드 문법에 사용할 수도 있다. 완전한 이터레이터이다. 하지만 제너테리엍 함수가 반환한 객체를 우리는 제너레이터 객체라고 부른다.

![16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled%203.png](16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled%203.png)

- 제너레이터가 처음 만들어지면 함수의 흐름은 멈춰 있는 상태이다. next()가 호출되면 다음 yield가 있는 곳 까지 호출하고, 다시 함수가 멈춘다.
- 제너레이터 함수의 이러한 특성으로 함수를 도중에 멈출 수도 있고, 순차적으로 여러 값을 반환시킬 수도 있다.
- next 함수에 파라미터를 받아서 제너레이터 함수에서 yield를 사용하여 해당 값을 조회할 수도 있다.

```tsx
function* sumGenerator() {
  let a = yield;
  let b = yield;
  yield a + b;
}

const sumGen = sumGenerator();
sumGen.next();
// {value: undefined, done: false}
sumGen.next(10);
// {value: undefined, done: false}
sumGen.next(20);
// {value: 30, done: false}
sumGen.next();
// {value: undefined, done: true}
```

- redux-saga는 이러한 제너테리어 함수 문법을 기반으로 비동기 작업을 관리해 준다.
- redux-saga는 우리가 디스패치하는 액션을 모니터링해서 그에 따라 필요한 작업을 따로 수행할 수 있는 미들웨어이다.

```tsx
function* watchGenerator() {
  console.log("start monitoring");
  let prevAction = null;
  while (true) {
    const action = yield;
    console.log("이전 액션:", prevAction);
    prevAction = action;
    if (action.type === "HELLO") {
      console.log("안녕하세요!");
    }
  }
}
```

- 위와 같은 원리로 동작하는 것이 redux-saga 이다.

## 2. 비동기 카운터 만들기

### 1. 액션 타입

```tsx
export const INCREASE = "counter/INCREASE";
export const DECREASE = "counter/DECREASE";
export const INCREASE_ASYNC = "counter/INCREASE_ASYNC";
export const DECREASE_ASYNC = "counter/DECREASE_ASYNC";
```

### 2. 액션 생성 함수

```tsx
const increase = createAction(INCREASE);
const decrease = createAction(DECREASE);

const increase_async = createAction<undefined>(INCREASE_ASYNC, () => undefined);
const decrease_async = createAction<undefined>(DECREASE_ASYNC, () => undefined);

export { increase, decrease, increase_async, decrease_async };
```

- 마우스 클릭 이벤트가 payload 안에 들어가지 않도록 () ⇒ undefined를 넣어준다.

### 3. 사가 만들기 \*\*\*

```tsx
import { delay, put, takeEvery, takeLatest } from "redux-saga/effects";

function* increaseSaga() {
  yield delay(1000);
  yield put(increase());
}

function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
}

export default function* counterSaga() {
  yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}
```

- delay : ms 단위로 시간을 기다린다.
- put : 특정 액션을 디스패치한다.
- takeEvery : 들어오는 모든 액션에 대해 특정 작업을 처리해준다. (모든 이벤트 처리)
- takeLatest : 들어오는 작업 중 마지막 작업만 처리한다. (약간 debounce와 throttle의 개념)

### 4. 리듀서 및 스토어

```tsx
const CounterStore = 0;

const CounterReducer = handleActions<number>(
  {
    [INCREASE]: (state) => state + 1,
    [DECREASE]: (state) => state - 1,
  },
  CounterStore
);
export default CounterReducer;
```

### 5. Connector

```tsx
const mapState = ({ counter }: RootStore) => ({
  counter,
});
const CounterConnector = connect(mapState, counterActions);
export default CounterConnector;
```

### 6. RootReducer

```tsx
const RootReducer = combineReducers({
  counter,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
```

### 7. RootSaga

```tsx
export default function* RootSaga() {
  yield all([counterSaga()]);
}
```

- all 함수는 여러 사가를 합쳐주는 역할을 한다.

### 8. Redux 및 Redux-Saga 적용하기

```tsx
const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
);
sagaMiddleware.run(RootSaga);
```

### \* . TakeEvery와 TakeLatest 차이

![16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled%204.png](16_Redux%20Middleware%20da491ca5000947a989a7d1d42465adf0/Untitled%204.png)

- TakeEvery로 만들어진 INCREASE_ASYNC 는 발생한 액션들을 모두 처리했지만, TakeLatest로 만들어진 DECREASE_ASYNC는 마지막 한번의 액션만 처리 되었다.

## 3. API 요청 상태 관리하기

### 1. Generator Type System

```tsx
interface Generator<T = unknown, TReturn = any, TNext = unknown>
  extends Iterator<T, TReturn, TNext> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

- Generator는 제네릭 타입으로 T, TReturn, TNext 를 받는다.

```tsx
type IteratorResult<T, TReturn = any> =
  | IteratorYieldResult<T>
  | IteratorReturnResult<TReturn>;
```

```tsx
interface IteratorYieldResult<TYield> {
  done?: false;
  value: TYield;
}

interface IteratorReturnResult<TReturn> {
  done: true;
  value: TReturn;
}
```

- Iterator의 타입시스템 구조는 다음과 같으며, Generator의 제네릭 타입들은 다음을 뜻한다.
  - T : 제너레이터에서 yield 키워드로 반환되는 타입
  - TReturn : 제너레이터에서 return 키워드로 반환되는 타입
  - TNext : next 함수로 arguments로 들어갈 타입

### 2. Saga With Generator Type

- 제너레이터 타입을 먼저 소개한 이유는 일반적으로 yield를 통해 액션만 일으킨다면 Generator 타입을 굳이 명시해줄 필요가 없다.
- 하지만, API를 처리할 Saga들은 yield를 통해 값을 받아와야 한다. Generator 타입을 명시하지 않아주면, 암묵적으로 yield의 리턴값은 any type으로 반환하는데 타입스크립트는 여기서 implicit any error 를 일으킨다.

```tsx
'yield' expression implicitly results in an 'any' type because its containing generator lacks a return-type annotation.
```

```tsx
function* getPostSaga(
  action: ReturnType<typeof getPost>
): Generator<any, any, any> {
  // (...)
}
```

- 그래서 위와 같이 타입을 맞춰주게 되는데, 위의 형식이 Saga에서 정말 안 좋은 이유는 실질적으로 Saga에서 사용하는 put, call과 같은 함수들은 우리가 원하는 타입이 아닌, Saga에서 쓰이는 타입을 반환하기 때문이다. 즉, 적어주면 코드가 더러워진다.

```tsx
const post: AxiosResponse<Post> = yield call(api.getPost, action.payload);
```

- 그래서 받는 부분에 변수에 타입을 명시적으로 지정해준다. 그러면 에러가 발생하지 않는다.

[Documentation - TypeScript 4.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html)

### 3. Api Saga

```tsx
function* getPostSaga(action: ReturnType<typeof getPost>) {
  yield put<Action>(startLoading(GET_POST));
  try {
    const post: AxiosResponse<Post> = yield call(api.getPost, action.payload);
    yield put<PostPayload>({
      type: GET_POST_SUCCESS,
      payload: post.data,
    });
  } catch (e) {
    yield put<PostPayload>({
      type: GET_POST_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put<Action>(finishLoading(GET_POST));
}

function* getUsersSaga(action: ReturnType<typeof getUsers>) {
  yield put<Action>(startLoading(GET_USERS));
  try {
    const users: AxiosResponse<User[]> = yield call(api.getUsers);
    yield put<UsersPayload>({
      type: GET_USERS_SUCCESS,
      payload: users.data,
    });
  } catch (e) {
    yield put<UsersPayload>({
      type: GET_USERS_FAILURE,
      payload: e,
      error: true,
    });
  }
  yield put<Action>(finishLoading(GET_USERS));
}
```

- API를 호출해야 하는 상황에는 사가 내부에서 직접 호출하지 않고, call 함수를 사용한다.

  첫 번째 인수는 호출하고 싶은 함수이고,

  그 뒤에 오는 인수들은 해당 함수에 넣어주고 싶은 인수이다.

### 4. Export Api Saga

```tsx
export default function* sampleSaga() {
  yield takeLatest(GET_POST, getPostSaga);
  yield takeLatest(GET_USERS, getUsersSaga);
}
```

### 5. 리팩토링

> createRequestSaga

```tsx
interface SagaAction<Payload = any> extends Action<string> {
  payload: Payload;
  error?: boolean;
}

export default function createRequestSaga<P = any, AR = any>(
  type: string,
  request: (...params: P[]) => Promise<AxiosResponse<AR>>
) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action: SagaAction<P>) {
    yield put(startLoading(type));
    try {
      const response: AxiosResponse<AR> = yield call(request, action.payload);
      yield put<SagaAction<AR>>({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      yield put<SagaAction<AR>>({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type));
  };
}
```

## 4. 알아 두면 유용한 기능들

### 1. saga 내부에서 현재 상태를 조회 (select)

```tsx
function* decreaseSaga() {
  yield delay(1000);
  yield put(decrease());
  const number: number = yield select((state) => state.counter);
  console.log(`현재 값은 ${number}`);
}
```

- 참고로 decreaseSaga는 takeLatest로 감싸져 있기 때문에, 계속 누르면 요청이 취소되기 때문에 select가 실행되지 않는다.

### 2. saga가 실행되는 주기를 제한하는 방법 (throttle)

```tsx
export default function* counterSaga() {
  // yield takeEvery(INCREASE_ASYNC, increaseSaga);
  yield throttle(3000, INCREASE_ASYNC, increaseSaga);
  yield takeLatest(DECREASE_ASYNC, decreaseSaga);
}
```

- 이벤트가 발생한 시점으로부터 3초후 동안 일어난 이벤트들은 무시한다. (이벤트 주기)

### 3. Redux-Saga는 다양한 기능을 제공해준다.

[Redux-Saga - An intuitive Redux side effect manager. | Redux-Saga](https://redux-saga.js.org/)
