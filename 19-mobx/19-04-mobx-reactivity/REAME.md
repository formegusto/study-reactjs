## 1. Defining data stores

- 해당 챕터는 거대한 구조의 프로젝트에서 MobX를 사용할 때 유용한 방법에 대해서 소개한다.
- 해당 챕터는 기존 코드베이스 또는 MVC 패턴에서 잘 동작하는 MobX를 사용할 것이다. 이 외에도 mobx-state-tree, mobx-keystone 등이 존재하는데, mobx 공식문서에서 매우 멋진 기능을 제공한다고 소개하고 있다. 마지막 즈음에 한번 다뤄보는 것으로 하자.

### 1. Stores

- store는 flux architecture에서 찾을 수 있고, MVC의 Controller와 비교할 수 있다. store의 주된 역할은 논리 및 상태를 프론트 엔드 및 백엔드에서 모두 사용할 수 있는 독립 실행형 테스트로서 동작하는 것이다.
- 대부분의 어플리케이션에는 도메인 상태용 저장소와 UI 상태용 저장소 등 최소 2개 이상의 저장소가 있어야 한다. 이 둘을 분리하면 도메인을 전체적으로 재사용하고, 테스트할 수 있으며, 다른 어플리케이션에서도 재사용할 수 있다는 이점이 있다.

### 2. domain stores

- 우리의 어플리케이션은 하나 혹은 여러개의 domain store로 구성이 될 것 이다. 이 저장소는 우리 어프리케이션의 모든 것들을 저장하고 있다.
- single domain store는 오직 하나의 컨셉만을 우리 어플리케이션에 반영한다. 이는 종종 multiple domain objects를 안에 두어 tree 구조를 형성하기도 한다.

### 3. Domain objects

- 각 각의 도메인 객체는 고유한 클래스 또는 생성자 함수를 사용해서 표현해야 한다. 이렇게 만들어진 도메인 객체는 다른 저장소의 도메인 객체를 직접 참조할 수 있다.
- Redux와 같은 Flux 아키텍처와 달리 MobX를 사용하면 데이터를 정상화할 필요가 없고, 어플리케이션의 기본적으로 복잡한 부분인 규칙, 작업 및 사용자 인터페이스를 훨씬 간단하게 구축할 수 있다.
- 독립형 도메인 개념을 보다 쉽게 사용할 수 있게 해주고, 어플리케이션에 필요한 상황 인식의 양을 줄일 수 있다. 생성자 함수를 사용하여 생성된 개체는 관찰 가능한 속성 및 메서드, 관찰 불가능한 속성 및 메서드를 자유롭게 혼합할 수 있다.
- 다음과 같은 형태가 가능하다는 뜻이다.

```tsx
class UserStore {
  user: User | null;

  constructor() {
    makeAutoObservable(this);
    this.user = null;
  }

  *fetchUser(id: number): Generator {
    try {
      const user = yield api.fetchUser(id);

      console.log(user);

      this.user = (user as AxiosResponse<User>).data;
    } catch (e) {
      console.error(e.response);
    }
  }
}

export default UserStore;
```

```tsx
class TodosStore {
  todos: Todo[];
  userStore: UserStore;

  constructor() {
    makeAutoObservable(this);
    this.userStore = new UserStore();
    this.todos = [];
  }

  fetchUser(idx: number) {
    this.userStore.fetchUser(this.todos[idx].userId);
  }

  *fetchTodos(): Generator {
    try {
      const res = yield api.fetchTodos();

      console.log(res);
      this.todos = (res as AxiosResponse<Todo[]>).data;
    } catch (e) {
      console.error(e.response);
    }
  }
}

export default TodosStore;
```

- Store 들간의 자유롭게 조합이 가능해진다.

### 4. UI stores

- ui-store는 종종 매우 특별한 형태로 우리 어플리케이션에서 사용된다.
- UI Store는 아래와 같은 상황에서 사용된다.
  1. 세션 정보
  2. 어플리케이션이 로드 되는 동안의 정보
  3. 백엔드에서 저장되지 않는 정보
  4. 전역적인 UI 효과
     1. 창 치수, 접근성 정보, 현재 언어, 현재 활성화된 테마
  5. 서로 관련 없는 여러 구성 요소에 영향을 미치는 인터랙션
     1. 현재 선택, 도구 모음 등의 가시성, wizard state, 전역 오버레이 상태

```tsx
export class UiState {
  language = "en_US";
  pendingRequestCount = 0;

  // .struct makes sure observer won't be signaled unless the
  // dimensions object changed in a deepEqual manner.
  windowDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  constructor() {
    makeAutoObservable(this, { windowDimensions: observable.struct });
    window.onresize = () => {
      this.windowDimensions = getWindowDimensions();
    };
  }

  get appIsInSync() {
    return this.pendingRequestCount === 0;
  }
}
```

### 5. Combining multiple stores

- 여러 저장소를 합치는 방법이다. 이는 RootStore를 따로 꺼내서 이용하면 된다.

```tsx
class RootStore {
  UserStore: UserStore;
  TodosStore: TodosStore;

  constructor() {
    this.UserStore = new UserStore(this);
    this.TodosStore = new TodosStore(this);
  }
}
```

```tsx
class UserStore {
  root: RootStore;
  users: User[];
  user: User | null;

  constructor(root: RootStore) {
    makeAutoObservable(this);
    this.root = root;
    this.users = [];
    this.user = null;
  }

  // ...
}
```

- 코드를 보면 store 내부에도 rootstore를 저장해놨는데, 이 짓을 왜 할까 생각을 해봤다. 다음과 같이 설정하면 스토어들 간에도 데이터 교류가 가능해져서 유용할 듯 하다.

# 2. not lite! provider and inject in mobx-react

[mobxjs/mobx-react](https://github.com/mobxjs/mobx-react/blob/master/README.md)

### 1. Basic

- 이렇게 MobX를 경험해보았다. store를 사용하고자 하는 곳에서 store 클래스 생성, observer component로의 전달이 기본 프로세스이다. 하지만 이렇게 되면 redux의 provider가 그리워질 것이다. 최상위에 provider에 store만 뚝! 해놓으면 사용하고자 하는 컴포넌트에서 connect만 하면 됐으니.. 하지만 mobx-react-lite가 아닌, mobx-react 라이브러리에서 이렇게 동작하도록 provider와 inject를 제공해주고 있다.

> **A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form @expression, where expression must evaluate to a function that will be called at runtime with information about the decorated declaration.**

```tsx
type ButtonProps = {
  color?: string;
};

@inject("color")
@observer
class Button extends React.Component<React.PropsWithChildren<ButtonProps>> {
  render() {
    return (
      <button style={{ background: this.props.color }}>
        {this.props.children}
      </button>
    );
  }
}

type MessageProps = {
  text: string;
};
function Message(props: MessageProps) {
  return (
    <div>
      {props.text} <Button>Delete</Button>
    </div>
  );
}

type RootProps = {
  messages: string[];
};

function InjectContainer(props: RootProps) {
  const children = props.messages.map((message) => <Message text={message} />);
  return (
    <Provider color="red">
      <div>{children}</div>
    </Provider>
  );
}

export default InjectContainer;
```

- 다음과 같이 최상위에 Provider Context를 씌어 놓으면 하위 컴포넌트에서 inject를 사용하여 Provider에 지정한 스토어를 가지고 올 수 있다.
- 위에서 decorator 문법이 쓰였는데, decorator 문법은 클래스와 그 프로퍼티들과 메서드를 위한 문법이기 때문에 함수형 컴포넌트에서는 사용할 수 없다. 그래서 함수형 문법으로 사용하고 싶다면 아래와 같이 선언하면 된다.

```tsx
const Button = inject("color")(
  observer((props: React.PropsWithChildren<ButtonProps>) => {
    return (
      <button style={{ background: props.color }}>{props.children}</button>
    );
  })
);
```

### 2. Customizing inject

- store name으로 가지고 오는 것 대신에 직접 mapperFunction을 보내서 매핑할 수도 있다.

```tsx
mapperFunction: (allStores, props, context) => additionalProps;
```

```tsx
// Provider
function App() {
  const inputStore = new InputStore({
    name: "",
    nickname: "",
  });

  return (
    <Provider inputStore={inputStore}>
      <InputContainer />
    </Provider>
  );
}

// Inject Components

inject((store: { inputStore: InputStore }) => ({
  store: store.inputStore,
}))(observer(InputContainer));
```

- 이 때 중요한 것은 inject가 반환하는 함수로 observer component를 넣어줘야 스토어의 반응에 대응한다.
