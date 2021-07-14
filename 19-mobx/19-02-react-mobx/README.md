# MobX And React

---

## 1. React integration

```tsx
import { observer } from "mobx-react-lite"; // Or "mobx-react".

const MyComponent = observer((props) => ReactElement);
```

- observer는 HoC로 React Component는 감싸서 mobx-store의 값을 주입해준다.

```tsx
class Timer {
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.secondsPassed += 1;
  }
}

const myTimer = new Timer();

// A function component wrapped with `observer` will react
// to any future change in an observable it used before.
const TimerView = observer(({ timer }) => (
  <span>Seconds passed: {timer.secondsPassed}</span>
));

ReactDOM.render(<TimerView timer={myTimer} />, document.body);

setInterval(() => {
  myTimer.increaseTimer();
}, 1000);
```

- observer HoC는 자동적으로 React Component가 렌더링하는 도중에 관찰중인 상태를 구독할 수 있게 해준다. 결과적으로는 observable 값에 변화가 찾아오면 컴포넌트를 재 렌더링해준다.
- 또한 관련된 변경 사항이 없을 때, 구성 요소가 다시 렌더링되지 않도록 한다. 따라서 구성 요소에서 액세스는 할 수 있지만, 실제로 읽고 있지 않는 관찰 중인 상태에 대해서는 다시 렌더링되지 않는다. 이는 MobX가 응용 프로그램을 기준으로 매우 잘 최적화하게 하고 일반적으로는 과도한 렌더링을 방지하기 위해 추가코드가 필요하지 않게 해준다.

## 2. MobX In React Basic Structure

### 1. Set Store

```tsx
class TimerStore {
  number: number;

  constructor() {
    makeAutoObservable(this, {
      increaseTimer: action.bound,
    });
    this.number = 0;
  }

  increaseTimer() {
    this.number++;
  }
}

export default TimerStore;
```

### 2. connected component (container component)

```tsx
function TimerContainer({ number, increaseTimer }: TimerStore) {
  useEffect(() => {
    setInterval(() => {
      increaseTimer();
    }, 1000);
  }, [increaseTimer]);

  return <TimerComponent number={number} />;
}

type Props = {
  timer: TimerStore;
};

export default observer<Props>(({ timer }) => (
  <TimerContainer number={timer.number} increaseTimer={timer.increaseTimer} />
));
```

### 3. App.tsx

```tsx
function App() {
  const timer = new TimerStore();

  return <TimerContainer timer={timer} />;
}

export default App;
```

### 4. Report  🛖

> 상태관찰은 observable 변수이지만, 변화는 스토어에 알려진다.

```tsx
// TimerContainer.tsx
export default observer<TimerStore>(({ number, increaseTimer }) => (
  <TimerContainer number={number} increaseTimer={increaseTimer} />
));

// App.tsx
function App() {
  const timer = new TimerStore();

  return (
    <TimerContainer number={timer.number} increaseTimer={timer.increaseTimer} />
  );
}
```

![19_MobX%202fe7245acf854aed9a10ea94bfebed99/Untitled%201.png](19_MobX%202fe7245acf854aed9a10ea94bfebed99/Untitled%201.png)

- 스스로 정의를 내려 본건데, 위의 코드는 number의 변화는 관찰되지만, 정작 re-render는 일어나지 않는다. 위의 observer의 매개변수 코드가 잘 못된 것인데, 위와 같이 스토어 자체가 아닌, 부분적 프로퍼티로 받을 경우, makeAutoObservable로 감싸진 객체가 아닌, observable 자체의 값이 전달되기 때문에 제대로 동작하지 않는다.

> 클래스에 바로 박는 함수는 프로토타입 메서드이다. 구조분해로 props로 전달할 수 없다. 리마인드 하자

```tsx
class TimerStore {
  number: number;

  constructor() {
    makeAutoObservable(this);
    this.number = 0;
  }

  increaseTimer = () => {
    this.number++;
  };
  // increaseTimer() {
  //   this.number++;
  // }
}
```

- 단 쓴다면 위와 같이 쓰면 되지만, 구조분해 형식으로 전달하면 관찰하는 스토어 객체는 전달되지 않아서 container component에서 작동하지 않을 것이다.

## 3. Using external state in observer components

- observer component의 상태관리값으로 사용하는 법에 대한 챕터이다.

### 1. using props

```tsx
type Props = {
  timer: TimerStore;
};

const TimerView = observer<Props>(({ timer }) => <h1>{timer.number} 초</h1>);
```

```tsx
const timer = new TimerStore();

ReactDOM.render(<TimerView timer={timer} />, document.getElementById("root"));

setInterval(() => {
  timer.increaseTimer();
}, 1000);
```

### 2. using global variables

```tsx
const timer = new TimerStore();

const TimerViewGlobal = observer(() => <h1>{timer.number}초</h1>);

setInterval(() => {
  timer.increaseTimer();
}, 1000);
```

### 3. using React Context

```tsx
const TimerContext = createContext<TimerStore | null>(null);
```

```tsx
ReactDOM.render(
  <TimerContext.Provider value={new TimerStore()}>
    <TimerViewContext />
  </TimerContext.Provider>,
  document.getElementById("root")
);
```

```tsx
const TimerViewContext = observer(() => {
  const timer = useContext<TimerStore | null>(TimerContext);

  useEffect(() => {
    setInterval(() => {
      timer?.increaseTimer();
    }, 1000);
  }, [timer]);

  return <h1>{timer?.number} 초</h1>;
});
```

- MobX 공식 문서에서는 createContext의 value를 의도적으로 바꾸지 않을 것을 권장하고 있다.

## 4. using local obervable state in observer components

- observer component 에서 로컬로 observable을 설정하는 방법에 대한 챕터이다.

### 1. `useState` with observable class

```tsx
function TimerViewUseState() {
  const [timer] = useState<TimerStore>(new TimerStore());

  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}

export default observer(TimerViewUseState);
```

### 2. `useState` with local observable object

```tsx
function TimerViewUseState_2() {
  const [timer] = useState(() =>
    observable({
      number: 0,
      increase() {
        this.number++;
      },
    })
  );

  useEffect(() => {
    setInterval(() => {
      timer.increase();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}
```

- React.useState는 기본적으로 아래와 같은 형식을 가진다.

```tsx
export function useState<S>(initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```

- 그래서 함수형으로 보내기가 가능하다. 함수형으로 안달면 에러가 나는데, 익명 객체로 날렸기 때문에 number를 undefined로 컴파일러가 해석을 해버린다. 그래서 미리 함수로 정의해서 컴파일러가 읽게 해주는 것 같다.

### 3. `useLocalObservable` hook

```tsx
function TimerViewLocalObserver() {
  const timer = useLocalObservable(() => ({
    number: 0,
    increase() {
      this.number++;
    },
  }));

  useEffect(() => {
    setInterval(() => {
      timer.increase();
    }, 1000);
  }, [timer]);

  return <h1>{timer.number} 초</h1>;
}

export default observer(TimerViewLocalObserver);
```

## 5. Rules

### 1. You might not need locally observable state

- 일반적으로, MobX 공식 문서에서는 local component 상태 관리에 성급하게 적용하지 않는 것을 추천하고 있다. 이는 React의 Suspense 메커니즘을 잠글 수도 있기 때문인데, 컴포넌트 사이에 공유해야 할 데이터가 있을 경우 사용하는 것이 좋다고 한다.
- 오직 UI 상태를 위한 상태 관리로는 useState hook이 좋다고 한다.
- observer component는 깊거나, 계산해야하는 값이 있거나 다른 observer component와 공유해야하는 경우 사용하는 것이 좋다고 한다.

### 2. Always read observable inside observer components

- observer 는 오직 component를 감싸서 관찰할 수 있는 상태로 업그레이드 시켜준다. component에서 부르지 않는다면 이는 작동하지 않는다.

### 3. Grab values from objects as late as possible

- observer는 최적의 렌더링 성능을 내기 위해 객체를 참조해서 가지고 온다.
- 이는 오직 observer based component 에서만 일어나며, observer는 객체의 properties는 참조하지 않는다.
- 즉, 아래와 같은 경우에는 작동하지 않는다.

```tsx
const TimerView = observer(({ secondsPassed }) => <span>Seconds passed: {secondsPassed}</span>)

React.render(<TimerViewer secondsPassed={myTimer.secondsPassed} />, document.body
```

- 더 나아가, observer가 참조할 수 있는 대상은 myTimer다. secondsPassed는 범주에 속하지 않는다.

### 4. Don't pass observables into components that aren't observer

- observer로 래핑된 구성 요소는 구성 요소의 자체 렌더링 중에 사용되는 관찰 가능 항목 observer만 구독한다. 이게 무슨소리냐 아래 처럼 하면 presentational단에서는 작동안한다는 것이다.

```tsx
type Props = {
  timer: TimerStore;
};

function TimerContainer({ timer }: Props) {
  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);

  return <TimerComponent timer={timer} />;
}
```

```tsx
type Props = {
  timer: TimerStore;
};

function TimerComponent(props: Props) {
  return <h1>{props.timer.number} 초</h1>;
}
```

- 내 맘대로 또 해석해보자면, observer로 래핑된 component는 observable object를 관찰하지만, 기초로 다시 돌아가서 볼 때, 실질적으로 autorun과 같은 효과를 일으키던거는 안에 있는 observable properties에 의해서였다. (autorun과 observer 내부의 re-render를 똑같이 바라봐보자)
- 이 또한 똑같다. timer 자체는 변하지 않는다. 즉, autorun안에 timer만 있다고 작동하지는 않는다. timer안에 있는 number가 변화할 때, autorun은 작동하는 거다. 즉, observable properties 들을 보내줘야 정상적으로 observer로 감싸지 않은 component가 re-rendering 한다.

```tsx
const TimerContainer = observer(({ timer }: Props) => {
  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);

  return (
    <TimerComponent number={timer.number} increaseTimer={timer.increaseTimer} />
  );
});
```

```tsx
function TimerComponent(props: TimerStore) {
  return <h1>{props.number} 초</h1>;
}
```

```tsx
function TimerContainer({ timer }: Props) {
  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);
  return (
    <TimerComponent number={timer.number} increaseTimer={timer.increaseTimer} />
  );
}

export default observer<Props>(({ timer }) => <TimerContainer timer={timer} />);
```

- 그리고 이것저것 하다가 한 가지 발견한건데 위와 같은 형태는 TimerContainer를 observer로 감쌌다고 보기 힘든 형태이다. observer로 감싼 TimerContainer를 리턴하는 컴포넌트를 리턴한 것이다. 즉, TimerContainer는 observer로 감싸져 있지 않기 때문에, timer의 값이 아무리 변화해도, TimerComponent는 물론이고 TimerContainer는 리렌더링 되지 않는다.
- TimerContainer를 observer 래핑하고 싶다면 아래와 같이 작성한다.

```tsx
export default observer<Props>(TimerContainer);
```

- 반응성 이해에 대해 알아보는 것이 가장 좋은 방법이다.

[Understanding reactivity · MobX](https://mobx.js.org/understanding-reactivity.html)

### 5. Callback components might require <Observer>

```tsx
type Props = {
  onRender: () => ReactElement;
};

function TimeViewEmpty({ onRender }: Props): ReactElement {
  const [render, setRender] = useState<ReactElement | null>(null);
  useEffect(() => {
    setRender(onRender);
  }, [setRender, onRender]);

  return render ? render : <></>;
}
```

```tsx
function TimerContainer({ timer }: Props) {
  useEffect(() => {
    setInterval(() => {
      timer.increaseTimer();
    }, 1000);
  }, [timer]);
  return <TimeViewEmpty onRender={() => <h1>{timer.number}초</h1>} />;
}
```

- 다음과 같이 render가 완료된 후 callback을 실행시키는 Component가 있다고 쳤을 때, callback에 의해서 observer component에서 넘겨졌다고 쳐도 observer로 감싸져 있기 때문에 상태값 변화에도 반응하지 않는다.
- callback component를 observer로 감싸주거나, 아래와 같이 Observer Component로 감싸주면 반응한다.

```tsx
<TimeViewEmpty
  onRender={() => <Observer>{() => <h1>{timer.number}초</h1>}</Observer>}
/>
```

# React Optimizations

---

- MobX는 매우 빠르다고 한다. 종종 Redux보다 빠르다고 한다. 하지만 빠르게 하기 위한 Tip들을 준비하셨다. 그러면서 한 가지 프론트엔드 개발자를 위한 충고를 적어 주셨다. 좋은 패턴들은 우리의 어플리케이션을 충분히 빠르게 해줄 것이고, 여기서 그것들을 소개할 것이다.

## 1. Use many small components

- 위에서도 봤듯이, observer components는 observable values들을 추적하고 그들에게 변화가 찾아왔을 때, re-render를 한다. 우리는 mobx-basic에서도 봤듯이, 변화한 observable value에 대해서만 autorun이 반응하는 것을 확인했다. 이러한 MobX의 철학 속에서 발견할 수 있는 것은 observable value 단위로 작게 컴포넌트를 쪼갤수록 쓸데없는 렌더링이 안 일어난다는 것을 말해준다.

## 2. Render lists in dedicated components

- React는 Large Collection들에 대해서 변경된 구성 요소를 평가해야 해서, 이러한 대규모 컬렉션 렌더링에 적합하지 않은 것으로 악명이 높다. 따라서 컬렉션을 매핑하고 렌더링만 하며, 다른 것은 렌더링하지 않는 구성 요소로 나누는 것이 좋다.
- Bad Case

  아래 예제는, user.name이 변경됐을 때, TodoView Component를 불필요하게 체크하는 비용이 들게된다.

  하지만 결과적으로 TodoView의 re-render는 일어나지 않지만 이러한 reconcile process는 비용이 든다.

  ```tsx
  const MyComponent = observer(({ todos, user }) => (
    <div>
      {user.name}
      <ul>
        {todos.map((todo) => (
          <TodoView todo={todo} key={todo.id} />
        ))}
      </ul>
    </div>
  ));
  ```

- Good Case

  ```tsx
  const MyComponent = observer(({ todos, user }) => (
    <div>
      {user.name}
      <TodosView todos={todos} />
    </div>
  ));

  const TodosView = observer(({ todos }) => (
    <ul>
      {todos.map((todo) => (
        <TodoView todo={todo} key={todo.id} />
      ))}
    </ul>
  ));
  ```

## 3. Don't use array indexes as keys

## 4. Dereference values late

- mobx-react는 value들에 대해 가능한 늦게 dereference 시킬 것을 충고한다고 했다. 이것의 이유는 MobX는 관찰 가능한 값을 자동으로 참조하지 않는 구성 요소를 다시 렌더링하기 때문인데, 이 문제가 구성 요소 트리에서 더 깊이 발생하면 더 적은 수의 구성 요소가 다시 렌더링해야 한다.
- Slower Case

  ```tsx
  <DisplayName name={person.name} />
  ```

- Faster Case

  ```tsx
  <DisplayName person={person} />
  ```

  - 이 예에서 이름 [person.name](http://person.name) 속성 변경 시, DisplayName만 다시 렌더링되지만, 느린 예에서는 구성 요소의 소유자도 다시 렌더링해야 한다. 이것은 꼭 지킬필요는 없다. 소유 구성 요소의 렌더링 속도가 충분히 빠르면 이 방법이 잘 동작한다.

## 5. Function props

- mobx의 철학은 작은 observer component들을 많이 만드는 것이다. 이것은 각각 데이터들이 부분적으로 렌더링할 수 있도록 해주기 때문이다.

```tsx
const PersonNameDisplayer = observer(({ person }) => (
  <DisplayName name={person.name} />
));

const CarNameDisplayer = observer(({ car }) => (
  <DisplayName name={car.model} />
));

const ManufacturerNameDisplayer = observer(({ car }) => (
  <DisplayName name={car.manufacturer.name} />
));
```

- 하지만 다른 모양의 데이터가 많은 경우 이 작업은 많이 힘들어 진다. 대안은 데이터를 반환하는 함수를 사용하는 것이다.

```tsx
function DisplayerContainer({ car, person }: Props) {
  return (
    <>
      <DisplayerComponent
        getName={() => person.name}
        changeName={(e) => {
          person.changeName(e.target.value);
        }}
      />
      <DisplayerComponent
        getName={() => car.name}
        changeName={(e) => {
          car.changeName(e.target.value);
        }}
      />
    </>
  );
}
```

```tsx
function DisplayerComponent({ getName, changeName }: Props) {
  return (
    <>
      <h1>name: {getName()}</h1>
      <input onChange={changeName} />
    </>
  );
}

export default observer(DisplayerComponent);
```

- 다음과 같이 설정하면 위에 설정한 것과 같은 효과를 낼 수가 있다.
- person.name이 변경되면 1이 재렌더링 할 것이며, car.name이 변경되면 2가 재렌더링 될 것이다. 즉, 재사용성과 구성 요소 재렌더링을 최소한으로 유지할 수 있다.
