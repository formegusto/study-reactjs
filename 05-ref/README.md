# ref:DOM에 이름달기

- 일반 HTM에서 DOM 요소에 이름을 달 때는 id를 사용한다.
- 특정 DOM 요소에 어떤 작업을 해야 할 때 이렇게 요소에 id를 달면 CSS에서 특정 id에 특정 스타일을 적용하거나 자바스크립트에서 해당 id를 가진 요소를 찾아서 작업할 수 있다.
- HTML에서 id를 사용하여 DOM에 이름을 다는 것처럼 리액트 프로젝트 내부에서 DOM에 이름을 다는 방법이 있다. 바로 ref(reference의 줄임말) 개념이다.
- 리액트 컴포넌트에서도 id를 사용할 수는 있다. **JSX 안에서 DOM에 id를 달면 해당 DOM을 렌더링할 때 그대로 전달된다. 하지만 특수한 경우가 아니면 사용을 권장하지 않는다.**

  → **HTML에서 DOM의 id는 유일(unique)해야 하는데, 이런 상황에서는 중복 id를 가진 DOM이 여러 개 생기니 잘못된 사용**이다.

  → **ref는 전역적으로 작동하지 않고, 컴포넌트 내부에서만 작동하기 때문에 이런 문제가 생기지 않는다.**

# 1. ref는 어떤 상황에서 사용해야 할까?

- **특정 DOM에 작업을 해야 할 때 ref를 사용한다.**

  > DOM을 꼭 직접적으로 건드려야 할 때

## 1. 예제 컴포넌트 생성

```tsx
import React from "react";
import "./ValidationSample.css";

class ValidationComponent extends React.Component {
  state = {
    password: "",
    clicked: false,
    validated: false,
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });

    console.log(e.target.value);
  };

  handleButtonClick = () => {
    this.setState({
      clicked: true,
      validated: this.state.password === "0000",
    });
  };

  render() {
    return (
      <div>
        <input
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
        />
        <button onClick={this.handleButtonClick}>validate</button>
      </div>
    );
  }
}

export default ValidationComponent;
```

## 2. DOM을 꼭 사용해야 하는 상황

- state를 사용하여 우리에게 필요한 기능을 구현했지만, 가끔 state만으로 해결할 수 없는 기능이 있다.

  1. 특정 input에 포커스 주기
  2. 스크롤 박스 조작하기
  3. Canvas 요소에 그림 그리기 등

  → 다음과 같은 상황에서 **DOM에 직접적으로 접근해야 하기 때문에 이를 위해 ref를 사용한다.**

# 2. ref 사용

- 두 가지 사용법이 있다.

## 1. 콜백 함수를 통한 ref 설정

- ref를 만드는 가장 기본적인 방법이다. ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달해 주면 된다.
- ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달해주면 된다. 이 콜백 함수는 ref 값을 파라미터로 전달받는다.

```tsx
import React from "react";
import "./ValidationSample.css";

class ValidationComponent extends React.Component {
  **input: HTMLInputElement | null = null;**

	// (...)

  render() {
    return (
      <div>
        **<input
          ref={(ref) => {
            this.input = ref;
          }}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
        />**
        <button onClick={this.handleButtonClick}>validate</button>
      </div>
    );
  }
}

export default ValidationComponent;
```

## 2. createRef를 통한 ref 설정

- **ref를 만드는 또 다른 방법은 리액트에 내장되어 있는 createRef라는 함수를 사용하는 것**이다.
- 이 기능은 리액트 v16.3 부터 도입되었으며, 이전 버전에서는 작동하지 않는다.

```tsx
import React from "react";

class RefComponent extends React.Component {
  input: React.RefObject<HTMLInputElement> = React.createRef();

  handleFocus = () => {
    this.input.current?.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.input} />
      </div>
    );
  }
}

export default RefComponent;
```

## 3. 적용

```tsx
import React from "react";
import "./ValidationSample.css";

class ValidationComponent extends React.Component {
  input: React.RefObject<HTMLInputElement> | null = React.createRef();

  state = {
    password: "",
    clicked: false,
    validated: false,
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleButtonClick = () => {
    this.setState({
      clicked: true,
      validated: this.state.password === "0000",
    });

    **this.input?.current?.focus();**
  };

  render() {
    return (
      <div>
        <input
          ref={this.input}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
        />
        <button onClick={this.handleButtonClick}>validate</button>
      </div>
    );
  }
}

export default ValidationComponent;
```

# 3. 컴포넌트에 ref 달기

- **컴포넌트에 ref를 다는 방법은 DOM에 ref를 다는 방법과 같다.**

## 1. 사용법

- 리액트에서는 컴포넌트에도 ref를 달 수 있다. 이 방법은 주로 컴포넌트 내부에 있는 DOM을 컴포넌트 외부에서 사용할 때 쓴다.

```tsx
<MyComponent
  ref={(ref) => {
    this.myComponent = ref;
  }}
/>
```

## 2. 컴포넌트 초기 설정

- 먼저 ScrollBox 라는 컴포넌트 파일을 만들겠다. JSX의 인라인 스타일링 문법으로 스크롤 박스를 만들어보자. 그 다음에는 최상위 DOM에 ref를 달아 주자.

### 1. 컴포넌트 파일 생성

```tsx
import React from "react";

class ScrollBox extends React.Component {
  box: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const style: React.CSSProperties = {
      border: "1px solid black",
      height: "300px",
      width: "300px",
      overflow: "auto",
      position: "relative",
    };

    const innerStyle: React.CSSProperties = {
      width: "100%",
      height: "650px",
      background: "linear-gradient(white, black)",
    };

    return (
      <div style={style} ref={this.box}>
        <div style={innerStyle} />
      </div>
    );
  }
}

export default ScrollBox;
```

### 2. 컴포넌트에 메서드 생성

```tsx
import React from "react";

class ScrollBox extends React.Component {
  box: React.RefObject<HTMLDivElement> = React.createRef();

  **scrollToBottom = () => {
    if (this.box.current) {
      const { scrollHeight, clientHeight } = this.box.current;

      this.box.current.scrollTop = scrollHeight - clientHeight;
    }
  };**

	// (...)
}

export default ScrollBox;
```

### 3. 컴포넌트에 ref 달고 내부 메서드 사용

- 부모 컴포넌트에서 버튼으로 제어해보자.

```tsx
import React from "react";
import ScrollBox from "./atoms/ScrollBox";

class App extends React.Component {
  scrollBox: React.RefObject<ScrollBox> = React.createRef();

  render() {
    return (
      <>
        <ScrollBox ref={this.scrollBox} />
        <button onClick={() => this.scrollBox.current!.scrollToBottom()}>
          맨 밑으로
        </button>
      </>
    );
  }
}

export default App;
```

- 문법상으로는 onClick = {this.scrollBox.scrollBottom} 같은 형식으로 작성해도 틀린 것은 아니다. 하지만 컴포넌트가 처음 렌더링될 때는 this.scrollBox 값이 undefined이므로, this.scrollBox.scrollToBottom 값을 읽어 오는 과정에서 오류가 발생한다.
- 화살표 함수 문법을 사용하여 아예 새로운 함수를 만들고, 그 내부에서 this.scrollBox.scrollToBottom 메서드를 실행하면, 버튼을 누를 때 this.scrollBox.scrollToBttom 값을 읽어 와서 실행하므로, 오류가 발생하지 않는다.

# 4. 정리

- 컴포넌트 내부에서 DOM에 직접 접근해야 할 때는 ref를 사용한다.
- **서로 다른 컴포넌트끼리 데이터를 교류할 때 ref를 사용한다면 이는 잘못 사용된 것이다. 할수는 있지만, 이는 리액트 사상에 어긋난 설계**이다.

  → 컴포넌트끼리 데이터를 교류할 때는 언제나 데이터를 부모 ↔ 자식 흐름으로 교류해야 한다. 나중에 리덕스 혹은 Context API를 사용하여 효율적으로 교류하는 방법을 배울 것이다.
