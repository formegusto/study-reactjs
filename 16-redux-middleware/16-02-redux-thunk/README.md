# Redux-Thunk

- redux-thunk는 리덕스를 사용하는 프로젝트에서 비동기 작업을 처리할 때 가장 기본적으로 사용하는 미들웨어이다.
- 리덕스의 창시자인 댄 아브라모프(Dan Abramov)가 만들었으며, 리덕스 공식 매뉴얼에서도 이 미들웨어를 사용하여 비동기 작업을 다루는 예시를 보여 준다.

## 1. Thunk란?

- Thunk는 특정 작업을 나중에 할 수 있도록 미루기 위해 함수 형태로 감싼 것을 의미한다.

```tsx
const addOne = (x) => x + 1;
function addOneThunk(x) {
  const thunk = () => addOne(x);
  return thunk;
}

const fn = addOneThunk(1);
setTimeout(() => {
  const value = fan();
  console.log(value);
}, 1000);
```

- 해당 로직은 addOne이라는 함수의 연산을 나중에 하도록 미룰 수 있게 해준다.
- redux-thunk 라이브러리를 사용하면 thunk 함수를 만들어서 디스패치할 수 있다. 그러면 리덕스 미들웨어가 그 함수를 전달받아 **store의 dispatch와 getState를 파라미터로 넣어서 호출**해준다.

## 2. Thunk 미들웨어 적용하기

```tsx
import ReduxThunk from "redux-thunk";

const logger = createLogger();
const store = createStore(RootReducer, applyMiddleware(logger, ReduxThunk));
```

## 3. Thunk 생성함수 만들기

```tsx
const increaseAsync = () => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(increase());
  }, 1000);
};
const decreaseAsync = () => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(decrease());
  }, 1000);
};

const CounterActionCreators = {
  increase,
  decrease,
  increaseAsync,
  decreaseAsync,
};
```

```tsx
<div>
  <h1>{props.number}</h1>
  <button onClick={props.decreaseAsync}>-</button>
  <button onClick={props.increaseAsync}>+</button>
</div>
```

![Untitled 1](https://user-images.githubusercontent.com/52296323/121555368-ea78a600-ca4d-11eb-9012-9ed6ede9dca3.png)


- 처음에 디스패치되는 액션(increaseAsync)은 함수형태이고, 두 번째 액션(increase)은 객체 형태이다.
- 이것이 중요한 이유는 아래 에러에서 확인할 수 있다.

```
redux.js:275 Uncaught Error: Actions must be plain objects. Instead, the actual type was: 'function'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.
```

- 전에 actionCreator를 작성했을 때도 봤듯이 액션 생성함수들은 액션객체(plain object)를 반환해야 한다(에러 내용). 하지만 위에서 만든 thunk 생성 함수들은 함수(function object)를 반환했다.

```tsx
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }

      return next(action);
    };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

- 해당 코드는 Redux-Thunk의 코드이다. action 객체가 plain object가 아닌 function object 일 때, 해당 action 함수 객체를 실행시켜주는 역할을 하는 것이 Redux-Thunk 이다. 아래 부분이 실행된다고 보면된다.

```tsx
(dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(decrease());
  }, 1000);
};
```

- Redux에서의 plain object와 function object의 차이는 plain은 일반객체를 반환하기 때문에 동기적으로 작동한다. 그래서 우리가 만든 프로세스 대로 해당 기능을 작동하게 하는데 어렵다는 것이다.(비동기 작업을 할 경우) 반면에 function object는 함수 객체를 반환하기 때문에 함수안에 우리가 짠대로 액션을 작동할 수 있게 해준다는 것이다.
- 결론적으로 Redux-Thunk는 함수형태로 액션을 일으킬 수 있게 해줌으로써, 우리가 짠 비동기 프로세스를 처리할 수 있게 해준다. 굳이 비동기 프로세스가 아니어도 되지만, 비동기 일 경우 pending, success, failure를 처리해야하기 때문에 함수형태로 처리하는 것이 맞다.

## 4. 웹 요청 비동기 작업 처리하기

- 이번에 쓰일 API는 아래와 같다.

  GET https://jsonplaceholder.typicode.com/posts/:id

  GET https://jsonplaceholder.typicode.com/users

- 웹 요청은 기본적으로 3개의 액션이 들어간다.

  pending (요청) - 요청 실행 중 → success (성공) OR failure(실패)

### 1. 액션 타입 작성하기

```tsx
export const GET_POST = "sample/GET_POST";
export const GET_POST_SUCCESS = "sample/GET_POST_SUCCSS";
export const GET_POST_FAILURE = "sample/GET_POST_FAILURE";

export const GET_USERS = "sample/GET_USERS";
export const GET_USERS_SUCCESS = "sample/GET_USERS_SUCCESS";
export const GET_USERS_FAILURE = "sample/GET_USERS_FAILURE";
```

### 2. 액션 생성 함수 ( thunk - function object )

```tsx
interface SampleAction<DT = any> extends Action {
  payload?: DT;
  error?: boolean;
}

export const getPost =
  (id: number) => async (dispatch: Dispatch<SampleAction<Post>>) => {
    dispatch({ type: GET_POST });
    try {
      const response = await api.getPost(id);
      dispatch({
        type: GET_POST_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({ type: GET_POST_FAILURE, payload: e, error: true });
      throw e; // 나중에 컴포넌트단에서 에러를 조회할 수 있게 해 줌
    }
  };
export const getUsers =
  () => async (dispatch: Dispatch<SampleAction<Users[]>>) => {
    dispatch({ type: GET_USERS });
    try {
      const response = await api.getUsers();
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: GET_POST_FAILURE,
        payload: e,
        error: true,
      });
      throw e;
    }
  };
```

### 3. 리듀서 작성하기

```tsx
type Payload = Post | User[];
const SampleReducer = handleActions<SampleStore, Payload>(
  {
    [GET_POST]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: true,
      },
    }),
    [GET_POST_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false,
      },
      post: action.payload as Post,
    }),
    [GET_POST_FAILURE]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_POST: false,
      },
    }),
    [GET_USERS]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: true,
      },
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false,
      },
      users: action.payload as User[],
    }),
    [GET_USERS_FAILURE]: (state) => ({
      ...state,
      loading: {
        ...state.loading,
        GET_USERS: false,
      },
    }),
  },
  sampleStore
);

export default SampleReducer;
```

### 4. Connector 작성

```tsx
const mapState = ({ Sample }: RootStore) => ({
  ...Sample,
});

const SampleConnector = connect(mapState, { getPost, getUsers });
export default SampleConnector;
```

![Untitled 2](https://user-images.githubusercontent.com/52296323/121555445-fa908580-ca4d-11eb-8c03-1d9fd495d4a8.png)

### 5. 리팩토링

- 비동기 액션 생성함수를 작성할 때도 봤듯이, 일반적인 api 요청처리는 같은 형식을 가진다. 또한 액션 타입 또한 [actionname, actioname_SUCCESS, actionname_FAILURE] 와 같은 형식을 가진다.

> 액션 생성함수를 만들어주는 함수 (createRequestThunk)

```tsx
export default function createRequestThunk<AR = any, P = any>(
  type: string,
  request: (...params: P[]) => Promise<AxiosResponse<AR>>
) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return (...params: P[]) =>
    async (dispatch: Dispatch<any>) => {
      dispatch({ type });
      try {
        const response = await request(...params);
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      } catch (e) {
        dispatch({
          type: FAILURE,
          payload: e,
        });
        throw e;
      }
    };
}
```

- TypeScript 특성상 params를 반드시 보내줘야 하는 현상이 발생했다. 그래서 rest 방식으로 받도록 했다.

```tsx
export const getPost = createRequestThunk<Post, number>(GET_POST, api.getPost);
export const getUsers = createRequestThunk<User[]>(GET_USERS, api.getUsers);
```

> 액션 타입 생성해주는 함수

```tsx
export default function createActionType(type: string) {
  return [type, `${type}_SUCCESS`, `${type}_FAILURE`];
}
```

```tsx
export const [GET_POST, GET_POST_SUCCESS, GET_POST_FAILURE] =
  createActionType("sample/GET_POST");
export const [GET_USERS, GET_USERS_SUCCESS, GET_USERS_FAILURE] =
  createActionType("sample/GET_USERS");
```

### 6. 로딩 모듈 만들기

- 로딩 상태만 관리하는 리덕스 모듈을 따로 만들어보자

> 로딩 액션 타입

```tsx
export const START_LOADING = "loading/START_LOADING";
export const FINISH_LOADING = "loading/FINISH_LOADING";
```

> 로딩 액션 생성 함수

```tsx
export const startLoading = createAction<string, string>(
  START_LOADING,
  (type: string) => type
);
export const finishLoading = createAction<string, string>(
  FINISH_LOADING,
  (type: string) => type
);
```

> 로딩 리듀서

```tsx
type LoadingStore = {
  [key: string]: boolean;
};
const loadingStore: LoadingStore = {};

const LoadingReducer = handleActions<LoadingStore, string>(
  {
    [START_LOADING]: (state, action) => ({
      [action.payload]: true,
    }),
    [FINISH_LOADING]: (state, action) => ({
      [action.payload]: false,
    }),
  },
  loadingStore
);

export default LoadingReducer;
```

- LoadingStore는 현재 이루어지고 있는 액션타입을 키로 가지고 해당 액션의 로딩 상태를 나타내주는 스토어로 구성된다.

> Sample Connector 수정

```tsx
const mapState = ({ Sample, Loading: loading }: RootStore) => ({
  ...Sample,
  loading,
});
```

> createRequestThunk 수정

```tsx
export default function createRequestThunk<AR = any, P = any>(
  type: string,
  request: (...params: P[]) => Promise<AxiosResponse<AR>>
) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return (...params: P[]) =>
    async (dispatch: Dispatch<any>) => {
      dispatch({ type: START_LOADING, payload: type });
      dispatch({ type });
      try {
        const response = await request(...params);
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      } catch (e) {
        dispatch({
          type: FAILURE,
          payload: e,
        });
        throw e;
      }
      dispatch({ type: FINISH_LOADING, payload: type });
    };
}
```

- 이렇게 로딩 스토어를 따로 빼서 관리하면 Loading을 처리하는 리듀서들의 코드와 스토어에서 로딩 모듈 하나로 로딩을 모두 처리하므로, 굳이 리듀서의 스토어들에게 loading 프로퍼티를 따로 주지 않아도 되고, 코드가 짧아진다는 것이 최고의 장점이다.
- 왜냐하면 시작하기전에 로딩을 시작 시키는 로직, 성공했을때와 실패했을때 로딩을 끝내는 로직이 빠지기 때문이다.

> Container 코드 수정

```tsx
return (
  <SampleComponent
    loadingPost={loading[GET_POST]}
    loadingUsers={loading[GET_USERS]}
    post={post}
    users={users}
  />
);
```
