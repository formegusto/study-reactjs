# React - Redux

- yarn add react-redux @types/react-redux
- 리액트 프로젝트에서 리덕스를 사용할 때, 가장 많이 사용하는 패턴은 프레젠테이션 컴포넌트와 컨테이너 컴포넌트를 분리하는 것이다.
  - 프레젠테이션 컴포넌트란 주로 상태 관리가 이루어지지 않고, 그저 props를 받아 와서 화면에 UI를 보여 주기만 하는 컴포넌트를 말한다.
  - 컨테이너 컴포넌트는 리덕스와 연동되어 있는 컴포넌트로, 리덕스로부터 상태를 받아 오기도 하고 리덕스 스토어에 액션을 디스패치 하기도 한다.

## 1. counter 모듈 작성하기 및 container component 연동하기

- Ducks 패턴이 아닌, types.ts, actions.ts, index.ts, connector.ts 로 작성하도록 하겠다.
  - types.ts : 액션 타입 정의
  - actions.ts : 액션 생성 함수 정의
  - index.ts : 스토어 초기 상태 및 리듀서 정의
  - connector.ts : connect가 반환하는 함수 정의

### 1. 액션 타입 정의하기

```jsx
export const INCREMENT = 'counter/INCREASE';
export const DECREMENT = 'counter/DECREASE';
```

- 액션 타입은 주로 '모듈 이름/액션 타입' 과 같은 식으로 작성해서 후에 프로젝트가 커졌을 때, 액션의 이름이 충돌되지 않도록 한다.

### 2. 액션 생성 함수 만들기

```jsx
import { DECREMENT, INCREMENT } from './types';

export type CounterAction = {
  type: string,
};

export const counterActions = {
  increase: () => ({ type: INCREMENT }),
  decrease: () => ({ type: DECREMENT }),
};

export type CounterActions =
  | ReturnType<typeof counterActions.increase>
  | ReturnType<typeof counterActions.decrease>;
```

### 3. 초기 상태 및 리듀서 함수 만들기

```jsx
import { CounterActions } from './actions';
import { DECREMENT, INCREMENT } from './types';

type CounterStore = {
  number: number,
};

const countStore = {
  number: 0,
};

export type { CounterStore };

export default function CountReducer(
  state = countStore,
  action: CounterActions,
): CounterStore {
  switch (action.type) {
    case INCREMENT:
      return {
        number: state.number + 1,
      };
    case DECREMENT:
      return {
        number: state.number - 1,
      };
    default:
      return state;
  }
}
```

### 4. connector 만들기 (eq. 컨테이너 컴포넌트 연동하기)

- redux를 컨테이너 컴포넌트에 연동하려면 react-redux에서 제공해주는 connector 함수를 사용해야 한다. 이 함수는 아래와 같이 사용한다.

```tsx
connect(mapStateToProps, mapDispatchToProps)(Container);
```

- **mapStateToProps : 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수**
- **mapDispatchToProps : 액션 생성 함수를 컴포넌트의 props로 넘겨주기 위해 사용하는 함수**
- connect 함수를 호출하고 나면 또 다른 함수를 반환한다. 반환된 함수에 컴포넌트를 파라미터로 넣어 주면 리덕스와 연동된 컴포넌트가 만들어진다.
- mapStateToProps와 mapDispatchToProps에서 반환하는 객체 내부의 값들은 컴포넌트의 props로 전달된다.

```tsx
const makeContainer = connect(mapStateToProps, mapDispatchToProps);
makeContainer(Container);
```

- 보통은 아래와 같이 2가지 방식을 사용하지만,

```tsx
const mapState = ({ counter }: RootStore) => ({
  number: counter.number,
});

const mapDispatch = (dispatch: Dispatch<CounterActionType>) => ({
  increase: () => {
    dispatch(CounterActionCreators.increase());
  },
  decrease: () => {
    dispatch(CounterActionCreators.decrease());
  },
});

export default connect(mapState, mapDispatch)(CounterContainer);

// OR
export default connect(
  ({ counter }: RootStore) => ({
    number: counter.number,
  }),
  (dispatch: Dispatch<CounterActionType>) => ({
    increase: () => {
      dispatch(CounterActionCreators.increase());
    },
    decrease: () => {
      dispatch(CounterActionCreators.decrease());
    },
  }),
)(CounterContainer);
```

- Redux를 위한 코드는 Redux 모듈에 모아두기 위해서 아래와 같이 코드를 작성하고 Container에서 이를 가져와 사용하도록 한다.

```tsx
const mapState = ({ counter }: RootStore) => ({
  number: counter.number,
});

const mapDispatch = (dispatch: Dispatch<CounterActionType>) => ({
  increase: () => {
    dispatch(CounterActionCreators.increase());
  },
  decrease: () => {
    dispatch(CounterActionCreators.decrease());
  },
});

export const CounterConnector = connect(mapState, mapDispatch);
```

```tsx
export default CounterConnector(CounterContainer);
```

### 5. bindActionCreators

- 컴포넌트에서 액션을 디스패치하기 위해 각 액션 생성 함수를 호출하고 dispatch로 감싸는 작업은 조금 번거로워 보인다. 이 때, 리덕스에서 제공해주는 bindActionCreators를 사용하면 편하다.

```tsx
const mapDispatch = (dispatch: Dispatch<CounterAction>) =>
  bindActionCreators(
		{
			counterActions.increase,
			counterActions.decrease,
		}
		, dispatch);

// OR

const mapDispatch = (dispatch: Dispatch<CounterAction>) =>
  bindActionCreators(counterActions, dispatch);
```

- 하지만 아래와 같이 actionCreator 객체를 넣어주면 Redux에서 자동으로 bindActionCreators를 처리함

```tsx
export const CounterConnector = connect(mapState, counterActions);
```

## 2. todos 모듈 작성하기 및 container component 연동하기

> Redux Type Structure 에 대한 이야기

### 1. 액션 타입 정의 (types.ts)

```tsx
export const CHANGE_INPUT = 'todos/CHANGE_INPUT';
export const INSERT = 'todos/INSERT';
export const TOGGLE = 'todos/TOGGLE';
export const REMOVE = 'todos/REMOVE';
```

### 2. 액션 생성 함수 정의(actions.ts)

> 액션 객체 정의

```tsx
export interface Action<T = any> {
  type: T;
}
```

- Redux 에는 Action Type 이 정의 되어있는데, 해당 타입을 extends 하여 사용하면 generic T 로 보내준 타입으로 액션 객체를 정의할 수 있다.

```tsx
export interface TodosAction
  extends Action<
    typeof CHANGE_INPUT | typeof INSERT | typeof TOGGLE | typeof REMOVE
  > {
  input?: string;
  id?: number;
  todo?: Todo;
}
```

- Payload로 따라오게 될 변수들은 option bags 패턴으로 정의한다.

> 액션 생성 함수 정의

```tsx
export interface ActionCreator<A> {
  (...args: any[]): A;
}
```

```tsx
export interface ActionCreatorsMapObject<A = any> {
  [key: string]: ActionCreator<A>;
}
```

- ActionCreator<A> 타입은 단일 액션 생성함수를 말한다.
- ActionCreatorsMapObject<A = any> 타입은 단일 액션 생성함수를 그룹핑하여 가지고 있는 액션 생성함수 Map 객체를 말한다.

```tsx
export const todosActionCreator: ActionCreatorsMapObject<TodosAction> = {
  changeInput: (input: string) => ({ type: CHANGE_INPUT, input }),
  insert: (text: string) => ({
    type: INSERT,
    todo: {
      id: id++,
      text: text,
      done: false,
    },
  }),
  toggle: (id: number) => ({
    type: TOGGLE,
    id,
  }),
  remove: (id: number) => ({
    type: REMOVE,
    id,
  }),
};
```

### 3. 초기 상태 및 리듀서 작성

```tsx
export default function todosReducer(
  state = initialState,
  action: TodosAction,
): TodosStore {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: action.input!,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(action.todo!),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id
            ? {
                ...todo,
                done: !todo.done,
              }
            : todo,
        ),
      };
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
}
```

![15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled.png](15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled.png)

- Actions의 타입을 정의해줌으로서, 다음과 같이 제한된 액션 타입을 가질 수 있다.

### 4. connector 만들기 (eq. 컨테이너 컴포넌트 연동하기)

```tsx
const mapState = ({ todos }: RootStore): TodosStore => ({
  ...todos,
});

const TodosConnector = connect(mapState, todosActionCreator);
```

- 다음과 같이 Connector를 정의해주면 아래와 같은 타입을 얻을 수 있다.

![15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled%201.png](15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled%201.png)

- mapState가 반환해주는 TodosStore와 todosActionCreator가 자동으로 bindActionCreators로 감싸지며 ActionCreatorsMapObject<TodosAction>의 형태를 띄게 됐다.
- dispatch 함수들이 타입에 안 붙는 단점이 존재하지만, [x:string] : ActionCreator<TodosAction> 같은 형태를 띄는 것이 맞는거 같긴하다. (후에 dispatchProps도 다룰 수 있는 방법을 찾으면 수정하도록 하겠다.)

## 3. Container Component에 연동하기 전에 해야할 작업

### 1. 루트 리듀서 만들기

- 두 개의 리듀서 (counter, todos)를 합치기 위해 createStore가 아닌 combineReducers 유틸 함수를 사용하여 합쳐서 export 시킨다.

```tsx
const rootReducer = combineReducers({
  counter: countReducer,
  todos: todosReducer,
});

type RootStore = ReturnType<typeof rootReducer>;

export type { RootStore };
export default rootReducer;
```

### 2. 스토어 만들기

```tsx
const store = createStore(rootReducer);
```

### 3. Provider 컴포넌트를 사용하여 프로젝트에 리덕스 적용하기

```tsx
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

- 생성한 스토어를 Provider의 props로 넘겨준다.

### + Redux DevTools의 설치 및 적용

- 리덕스의 액션 및 상태의 변화를 확인할 수 있게 해주는 툴이다.
- Chrome에 Redux DevTools 확장 프로그램을 설치해주자.
- yarn add redux-devtools-extension

```tsx
const store = createStore(
  rootReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
```

# 리덕스 더 편하게 사용하기

## 1. redux-action

- redux-action를 사용하면 액션 생성 함수를 더 짧은 코드로 작성할 수 있다.

### 1. createAction

```tsx
const changeInput = createAction<Payload, string>(
  CHANGE_INPUT,
  (input: string) => ({ input }),
);
const insert = createAction<Payload, string>(INSERT, (text: string) => ({
  todo: {
    id: id++,
    text: text,
    done: false,
  },
}));
const toggle = createAction<Payload, number>(TOGGLE, (id: number) => ({
  id,
}));
const remove = createAction<Payload, number>(REMOVE, (id: number) => ({
  id,
}));

export const todosActionCreator = {
  changeInput,
  insert,
  toggle,
  remove,
};
```

- TypeScript 에서 react-action을 사용했을 때, 최고의 장점은 Type을 더욱 정형화 할 수 있다는 것이다. 이로인해 타입 추론이 더욱 단단해진다.

> Payload Type 정의

```tsx
export type Payload = {
  input?: string;
  id?: number;
  todo?: Todo;
};

export interface TodosAction
  extends Action<
    typeof CHANGE_INPUT | typeof INSERT | typeof TOGGLE | typeof REMOVE
  > {
  payload: Payload;
}
```

```tsx
export default function todosReducer(
  state = initialState,
  { type, payload }: TodosAction,
): TodosStore {
  switch (type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: payload.input!,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(payload.todo!),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === payload.id
            ? {
                ...todo,
                done: !todo.done,
              }
            : todo,
        ),
      };
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== payload.id),
      };
    default:
      return state;
  }
}
```

> Connected Props 타입 추론 가능

- ActionCreatorsMapObject 타입에 비해 정형화된 타입을 제공해준다.

![15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled%202.png](15_Redux%20cd70a0bcdd7847f0b7ba1947189b53db/Untitled%202.png)

### 2. handleActions

```tsx
const todosReducer = handleActions<TodosStore, Payload>(
  {
    [CHANGE_INPUT]: (state, { payload }) => ({
      ...state,
      input: payload.input!,
    }),
    [INSERT]: (state, { payload }) => ({
      ...state,
      todos: state.todos.concat(payload.todo!),
    }),
    [TOGGLE]: (state, { payload }) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === payload.id
          ? {
              ...todo,
              done: !todo.done,
            }
          : todo,
      ),
    }),
    [REMOVE]: (state, { payload }) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== payload.id),
    }),
  },
  initialState,
);
```

- handleActions 가 Actions<Payload> 를 생성해주고, switch 문이 아닌 내부적인 객체로 type을 컨트롤 하므로, payload 만 신경써주면 된다.

## 2. immer

```tsx
const todosReducer = handleActions<TodosStore, Payload>(
  {
    [CHANGE_INPUT]: (state, { payload }) =>
      // input은 값 자체이기 때문에 draft 에서 변경 시켜야함
      produce(state, (draft) => {
        draft.input = payload.input!;
      }),
    [INSERT]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        todos.push(payload.todo!);
      }),
    [TOGGLE]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        const todo = todos.find((todo) => todo.id === payload.id);
        todo!.done = !todo?.done;
      }),
    [REMOVE]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        const idx = todos.findIndex((todo) => todo.id === payload.id);
        todos.splice(idx, 1);
      }),
  },
  initialState,
);
```

# Hooks를 사용하여 컨테이너 컴포넌트 만들기

## 1. useSelector로 상태 조회하기

```tsx
const result = useSelector(mapStateToProps);
```

- mapStateToProps의 형태는 connect에 붙는 mapStateToProps의 형태와 같다.

```tsx
const number = useSelector<RootStore, number>(
  ({ counter }: RootStore) => counter.number,
);
```

## 2. useDispatch를 사용하여 액션 디스패치하기

```tsx
const dispatch = useDispatch();
dispatch({ type: 'SAMPLE_ACTION' });
```

- 이 Hook은 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해준다.

```tsx
const dispatch = useDispatch<Dispatch<CounterAction>>();
const increase = useCallback(() => dispatch({ type: INCREMENT }), [dispatch]);
const decrease = useCallback(() => dispatch({ type: DECREMENT }), [dispatch]);
```

## 3. useStore를 사용하여 리덕스 스토어 사용하기

```tsx
const store = useStore();
store.dispatch({ type: 'SAMPLE_ACTION' });
store.getState();
```

- useStore Hooks를 사용하면 컴포넌트 내부에서 리덕스 스토어 객체를 직접 할 수 있다. useStore는 컴포넌트에서 정말 어쩌다가 스토어에 직접 접근해야 하는 상황에만 사용해야 한다.

## 4. connect 함수와의 주요 차이점

- Hooks를 사용하여 컨테이너 컴포넌트를 만들 때, 잘 알아 두어야 할 차이점이 존재한다.
- connect 함수를 사용하여 컨테이너 컴포넌트를 만들었을 경우, 해당 컨테이너 컴포넌트의 부모 컴포넌트가 리렌더링될 때 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지되어 성능이 최적화된다.
- 반면에 useSelector를 사용하여 리덕스 상태를 조회했을 때는 이 최적화 작업이 자동으로 이루어지지 않으므로, 성능 최적화를 위해서는 React.memo를 컨테이너 컴포넌트에 사용해 주어야 한다.
