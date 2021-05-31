# Component LifeCycle

- **모든 리액트 컴포넌트에는 라이프사이클(수명 주기)이 존재**한다. **컴포넌트의 수명은 페이지에 렌더링되기 전인 준비 과정에서 시작하여 페이지에서 사라질 때 끝난다.**

# 1. 라이프사이클 메서드의 이해

- **라이프사이클 메서드의 종류는 총 9가지**이다.

  → **Will** 접두사가 붙은 메서드는 어떤 작업을 **작동하기 전**에 실행되는 메서드 이다

  → **Did** 접두사가 붙은 메서드는 어떤 작업을 **작동한 후**에 실행되는 메서드 이다.

- 라이프사이클은 총 세 가지, 즉, **마운트, 업데이트, 언마운트** 카테고리로 나눠진다.

## 1. 마운트

- **constructor → getDerivedStateFromProps → render → componentDidMount**

  **constructor : 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드**

  **getDerivedStateFromProps : props에 있는 값을 state에 넣을 때 사용하는 메서드**

  **render : 준비한 UI를 렌더링하는 메서드**

  **componentDidMount : 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드**

## 2. 업데이트

- **컴포넌트는 다음과 같은 총 4가지 경우에 업데이트 한다.**
  1. **props가 바뀔 때**
  2. **state가 바뀔 때**
  3. **부모 컴포넌트가 리렌더링될 때**
  4. **this.forceUpdate로 강제로 렌더링을 트리거할 때**
- **(업데이트를 발생 시키는 요인 1,2,3 의 경우) → getDerivedStateFromProps → shouldComponentUpdate → (4의 요인일 경우) → render → getSnapshotBeforeUpdate → componentDidUpdate**

  **getDerivedStateFromProps : 이 메서드는 마운트 과정에서도 호출되며, 업데이트가 시작하기 전에도 호출된다. props의 변화에 따라 state 값에도 변화를 주고 싶을 때, 사용한다.**

  **shouldComponentUpdate : 컴포넌트가 리렌더링을 해야 할지 말아야 할지를 결정하는 메서드이다. 이 메서드에서는 true 혹은 false 값을 반환해야 하며, true를 반환하면 다음 라이프사이클 메서드를 계속 실행하고, false를 반환하면 작업을 중지한다. 즉, 컴포넌트가 리렌더링 되지 않는다.**

  **render : 컴포넌트를 리렌더링한다.**

  **getSnapshotBeforeUpdate : 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출하는 메서드이다.**

  **componentDidUpdate : 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드이다.**

## 3. 언마운트

- 마운트의 반대과정. 즉, 컴포넌트를 DOM에서 제거하는 것을 언마운트(unmount)라고 한다.
- **componentWillUnmount : 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드**

# 2. 라이프사이클 메서드 살펴보기

- React.Component
- ComponentLifecycle

## 1. render()

```tsx
render() { ... }
```

- 이 메서드는 **컴포넌트 모양새를 정의**한다.
- 라이프사이클 메서드 중 **유일한 필수 메서드**이다.
- 이 메서드 안에서 **this.props와 this.state에 접근**할 수 있으며, **리액트 요소를 반환**한다.
- **아무것도 보여주고 싶지 않다면 null 값이나 false 값을 반환**하도록 한다.
- **해당 메서드 안에서는 이벤트 설정이 아닌 곳에서 setState를 사용하면 안된다.**
- **브라우저의 DOM에 접근해서도 안된다.**
- **DOM 정보를 가져오거나 state에 변화를 줄 때는 componentDidMount에서 처리**한다.

## 2. constructor()

```tsx
constructor(props: Readonly<P> | P);
```

- 컴포넌트의 생성자 메서드로 컴포넌트를 만들 때, **처음으로 실행**된다. 이 메서드에서는 **초기 state**를 정할 수 있다.

## 3. getDerivedStateFromProps()

```tsx
getDerivedStateFromProps?: GetDerivedStateFromProps<P, S>;
type GetDerivedStateFromProps<P, S> =
        (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;
```

- 리액트 v16.3 이후에 새로 만든 라이프사이클 메서드이다. **props로 받아 온 값을 state에 동기화시키는 용도로 사용**하며, **컴포넌트가 마운트될 때와 업데이트될 때 호출**된다.
- P, S 는 Props, State를 나타내며 ComponentClass interface 를 보면 해당 제네릭 타입으로 props와 state 타입을 설정하는 것을 볼 수 있다.

```tsx
interface ComponentClass<P = {}, S = ComponentState>
  extends StaticLifecycle<P, S> {
  new (props: P, context?: any): Component<P, S>;
  propTypes?: WeakValidationMap<P>;
  contextType?: Context<any>;
  contextTypes?: ValidationMap<any>;
  childContextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}
```

## 4. componentDidMount()

```tsx
componentDidMount?(): void;
```

- **컴포넌트를 만들고, 첫 렌더링을 다 마친 후 실행**된다. 이 안에서 다른 자바스크립트 라이브러리 또는 프레임워크의 함수를 호출하거나 이벤트 등록, setTimeout, setInterval, 네트워크 요청 같은 비동기 작업을 처리할 수 있다.

## 5. shouldComponentUpdate()

```tsx
shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
```

- **props 또는 state를 변경했을 때, 리렌더링을 시작할지 여부를 지정하는 메서드**이다. **메서드에서는 반드시 true값 또는 false 값을 반환**해야 한다.
- **컴포넌트를 만들 때 이 메서드를 따로 생성하지 않으면 기본적으로 언제나 true 값을 반환**한다. 이 메서드가 **false 값을 반환한다면 업데이트 과정은 여기서 중지**된다.
- **이 메서드 안에서 현재 props와 state는 this.props와 this.state로 접근하고, 새로 설정될 props 또는 state는 nextProps와 nextState로 접근**할 수 있다.
- 상황에 맞는 알고리즘을 작성하여 리렌더링을 방지할 때는 false 값을 반환하게 한다.

## 6. getSnapshotBeforeUpdate()

```tsx
getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
```

- 리액트 v16.3 이후 만든 메서드이다. 이 메서드는 **render에서 만들어진 결과물이 브라우저에 실제로 반영되기 직전에 호출**된다.
- **이 메서드에서 반환하는 값은 componentDidUpdate에서 3번째 파라미터인 snapshot 값으로 전달**받을 수 있다. **주로 업데이트하기 직전의 값을 참고할 일이 있을 때 활용**된다. (예: 스크롤바 위치 유지)

## 7. componentDidUpdate()

```tsx
componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
```

- **리렌더링을 완료한 후 실행**한다. 업데이트가 끝난 직후이므로, **DOM 관련 처리를 해도 무방**하다.
- 여기서는 prevProp 또는 prevState를 사용하여 **컴포넌트가 이전에 가졌던 데이터에 접근**할 수 있다. **또 getSnapshotBeforeUpdate 에서 반환한 값**이 있다면 여기서 **snapshot 값**을 전달받을 수 있다.

## 8. componentWillUnmount()

```tsx
componentWillMount?(): void;
```

- **이것은 컴포넌트를 DOM에서 제거할 때 실행**한다.
- **componentDidMount에서 등록한 이벤트, 타이머, 직접 생성한 DOM이 있다면 여기서 제거 작업**을 해야한다.

## 9. componentDidCatch()

```tsx
componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
```

- 리액트 v16에서 새롭게 도입되었으며, **컴포넌트 렌더링 도중에 에러가 발생했을 때, 어플리케이션이 먹통이 되지 않고 오류 UI를 보여 줄 수 있게 해준다.**
- 여기서 **error는 파라미터에 어떤 에러가 발생했는지 알려 주며**, **info 파라미터는 어디에 있는 코드에서 오류가 발생했는지에 대한 정보를 준다.** 앞의 코드에서는 그저 console.log만 했지만, 나중에 실제로 사용할 때 오류가 발생하면 서버 API를 호출하여 따로 수집할 수도 있다.
- 그러나 이 메서드를 사용할 때는 컴포넌트 **자신에게 발생하는 에러를 잡아낼 수 없고**, **자신의 this.props.children으로 전달되는 컴포넌트에서 발생하는 에러만 잡아낼 수 있다는 점**을 알아두어야 한다.

# 3. 라이프사이클 메서드 사용하기

## 1. 예제 컴포넌트 생성

- LifeCycleComponent.tsx

  ```tsx
  import React from "react";

  type Props = {
    color: string;
  };

  type State = {
    number: number;
    color: string | null;
  };

  class LifeCycleComponent extends React.Component<Props, State> {
    state = {
      number: 0,
      color: null,
    };

    myRef: React.RefObject<HTMLHeadingElement> = React.createRef();

    constructor(props: Props) {
      super(props);

      console.log("constructor");
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
      console.log("getDerivedStateFromProps");
      if (nextProps.color !== prevState.color) {
        return { color: nextProps.color };
      }
      return null;
    }

    componentDidMount() {
      console.log("componentDidMount");
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
      console.log("shouldComponentUpdate", nextProps, nextState);
      return nextState.number % 10 !== 4;
    }

    componentWillUnmount() {
      console.log("componentWillUnmount");
    }

    handleClick = () => {
      this.setState({
        number: this.state.number + 1,
      });
    };

    getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
      console.log("getSnapshotBeforeUpdate");
      if (prevProps.color !== this.props.color) {
        return this.myRef.current!.style.color;
      }
      return null;
    }

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: State) {
      console.log("componentDidUpdate", prevProps, prevState);
      if (snapshot) {
        console.log("업데이트되기 직전 색상: ", snapshot);
      }
    }

    render() {
      const style: React.CSSProperties = {
        color: this.props.color,
      };

      return (
        <div>
          <h1 style={style} ref={this.myRef}>
            {this.state.number}
          </h1>
          <p>color: {this.state.color}</p>
          <button onClick={this.handleClick}>더하기</button>
        </div>
      );
    }
  }

  export default LifeCycleComponent;
  ```

- App.tsx

  ```tsx
  import React from "react";
  import LifeCycleComponent from "./LifeCycleComponent";

  function getRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  class App extends React.Component {
    state = {
      color: "#000000",
    };

    handleClick = () => {
      this.setState({
        color: getRandomColor(),
      });
    };

    render() {
      return (
        <>
          <button onClick={this.handleClick}>랜덤 색상</button>
          <LifeCycleComponent {...this.state} />
        </>
      );
    }
  }

  export default App;
  ```

![07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled.png](07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled.png)

Mount

![07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled%201.png](07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled%201.png)

Color Update

![07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled%202.png](07_Component%20LifeCycle%2046b6ba1e40204c3a987b065566a025da/Untitled%202.png)

Number Update

- shouldComponentUpdate 에서 return nextState.number % 10 !== 4; 를 통해, 끝에 4가 붙는 숫자들은 false를 뱉어내면서 state가 업데이트 되지 않도록 했다.

## 2. 에러 잡아내기

- LifeCycleComponent.tsx

  ```tsx
  import React from "react";

  type Props = {
    color: string;
    rest: any;
  };

  type State = {
    number: number;
    color: string | null;
  };

  class LifeCycleComponent extends React.Component<Props, State> {
    // (...)

    render() {
      const style: React.CSSProperties = {
        color: this.props.color,
      };

      return (
        <div>
          **{this.props.rest.missing.value};**
          <h1 style={style} ref={this.myRef}>
            {this.state.number}
          </h1>
          <p>color: {this.state.color}</p>
          <button onClick={this.handleClick}>더하기</button>
        </div>
      );
    }
  }

  export default LifeCycleComponent;
  ```

  **존재하지 않는 props인 rest.missing 객체의 value를 조회해서 렌더링해주려고 하면 undefined 에러가 발생한다. 이렇게 어디에서 에러가 발생하는지 알 수 있는 정보가 나타난 것은 현재 개발 서버를 실행 중이기 때문이다.**

  실제 웹 서비스에서는 에러 정보가 아닌, 우리가 에러 정보를 닫고 난 후에 보이는 흰 페이지만 보이게 된다.

- ErrorBoundary.tsx

  ```tsx
  import React from "react";

  type State = {
    error: false;
  };
  class ErrorBoundary extends React.Component {
    state: State = {
      error: false,
    };

    componentDidCatch(error: any, info: any) {
      this.setState({
        error: true,
      });
      console.log(error, info);
    }

    render() {
      if (this.state.error) return <div>에러가 발생했습니다!</div>;
      return this.props.children;
    }
  }

  export default ErrorBoundary;
  ```

  **에러가 발생하면 componentDidCatch 메서드가 호출되며, 이 메서드는 this.state.error 값을 true로 업데이트 해주면서 에러가 발생했다는 메시지를 보여준다.**

- App.tsx 사용하기

  ```tsx
  import React from "react";
  import ErrorBoundary from "./ErrorBoundary";
  import LifeCycleComponent from "./LifeCycleComponent";

  function getRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  class App extends React.Component {
    // (...)

    render() {
      return (
        <>
          <button onClick={this.handleClick}>랜덤 색상</button>
          **<ErrorBoundary>
            <LifeCycleComponent {...this.state} />
          </ErrorBoundary>**
        </>
      );
    }
  }

  export default App;
  ```

# 4. 정리

- 라이프사이클 메서드는 컴포넌트 상태에 변화가 있을 때마다 실행하는 메서드이다.
- **해당 메서드들은 서드파티 라이브러리를 사용하거나 DOM을 직접 건드려야 하는 상황에서 유용**하다.
- **추가로 컴포넌트 업데이트의 성능을 개선할 때는 shouldComponentUpdate가 중요하게 사용**된다.
