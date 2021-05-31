# Event Handling

# 1. 리액트의 이벤트 시스템

- 리액트의 이벤트 시스템은 웹 브라우저의 HTML 이벤트와 인터페이스가 동일하기 때문에 사용법이 꽤 비슷하다.

```tsx
import React, { useState } from "react";

const SayComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const onClickEnter = () => setMessage("안녕하세요!");
  const onClickLeave = () => setMessage("안녕히 가세요!");

  const [color, setColor] = useState("black");

  return (
    <div>
      <button onClick={onClickEnter}>입장</button>
      <button onClick={onClickLeave}>퇴장</button>
      <h1 style={{ color }}>{message}</h1>
      <button style={{ color: "red" }} onClick={() => setColor("red")}>
        빨간색
      </button>
      <button style={{ color: "green" }} onClick={() => setColor("green")}>
        초록색
      </button>
      <button style={{ color: "blue" }} onClick={() => setColor("blue")}>
        파란색
      </button>
    </div>
  );
};

export default SayComponent;
```

## 1. 이벤트를 사용할 때 주의 사항

1. 이벤트 이름은 **카멜 표기법**으로 작성한다.
2. 이벤트에 실행할 자바스크립트 코드를 전달하는 것이 아니라, **함수 형태의 값을 전달**한다.
   - HTML에서 이벤트를 설정할 때는 큰따옴표 안에 실행할 코드를 넣었지만, 리액트에서는 **함수 형태의 객체를 전달**한다.
   - 앞서 버튼 예제에서도 화살표 함수 문법으로 함수를 만들어 전달했다. 이처럼 바로 만들어서 전달해도 되고, 렌더링 부분 외부에 미리 만들어서 전달해도 된다.
3. **DOM 요소에만 이벤트를 설정**할 수 있다.
   - 직접 만든 컴포넌트에는 이벤트를 자체적으로 설정할 수 없다.
   - 직접 만든 컴포넌트에 전달시, 그냥 이름이 onClick인 props를 자신의 컴포넌트에게 전달해줄 뿐이다.

## 2. 이벤트 종류

- 리액트에서 지원하는 이벤트 종류

  Clipboard

  Composition

  Keyboard

  Focus

  Form

  Mouse

  Selection

  Touch

  UI

  Wheel

  Media

  Image

  Animation

  Transition

# 2. 예제로 이벤트 핸들링 익히기

## 1. 컴포넌트 생성 및 불러오기

### 1. 컴포넌트 생성

```tsx
import React from "react";

class EventComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
      </div>
    );
  }
}

export default EventComponent;
```

### 2. App.tsx 에서 EventComponent 렌더링

```tsx
import React from "react";
import EventComponent from "./EventComponent";

const App: React.FC = () => {
  return <EventComponent />;
};

export default App;
```

## 2. onChange 이벤트 핸들링하기

### 1. onChange 이벤트 설정

```tsx
import React from "react";

class EventComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          onChange={(e) => {
            console.log(e);
          }}
        />
      </div>
    );
  }
}

export default EventComponent;
```

![04_Event%20Handling%20175506738ca643a29d0078530c84f545/Untitled.png](04_Event%20Handling%20175506738ca643a29d0078530c84f545/Untitled.png)

- **SyntheticBaseEvent 객체로, 웹 브라우저의 네이티브 이벤트를 감싸는 객체**이다. 네이티브 이벤트와 인터페이스가 같으므로, **순수 자바스크립트에서 HTML 이벤트를 다룰 때와 똑같이 사용**하면 된다.
- **SyntheticEven는 네이티브 이벤트와 달리 이벤트가 끝나고 나면 이벤트가 초기화**되므로, 정보를 참조할 수 없다.

  → 0.5초 뒤에 e 객체를 참조하면 e 객체 내부의 모든 값이 비워지게 된다.

- **만약, 비동기적으로 이벤트 객체를 참조할 일이 있다면 e.persist() 함수를 호출**해주어야 한다. 예를 들어 onChange 이벤트가 발생할 때, 앞으로 변할 인풋 값인 e.target.value를 콘솔에 기록해보겠다.

![04_Event%20Handling%20175506738ca643a29d0078530c84f545/Untitled%201.png](04_Event%20Handling%20175506738ca643a29d0078530c84f545/Untitled%201.png)

### 2. state에 input 값 담기

- 생성자 메서드인 constructor에 state 초깃값을 설정하고, 이벤트 핸들링 함수 내부에서 this.setState 메서드를 호출하여 state를 업데이트해 보자.

```tsx
import React from "react";

class EventComponent extends React.Component {
  state = {
    msg: "",
  };

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          value={this.state.msg}
          onChange={(e) => {
            this.setState({
              msg: e.target.value,
            });
          }}
        />
      </div>
    );
  }
}

export default EventComponent;
```

### 3. 버튼을 누를 때 comment 값을 공백으로 설정

- input 요소 코드 아래쪽에 button을 하나 만들고, 클릭 이벤트가 발생하면 현재 comment 값을 메시지 박스로 띄운 후, comment 값을 공백으로 설정하겠다.

```tsx
import React from "react";

class EventComponent extends React.Component {
  state = {
    msg: "",
  };

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          value={this.state.msg}
          onChange={(e) => {
            this.setState({
              msg: e.target.value,
            });
          }}
        />
        <button
          onClick={() => {
            alert(this.state.msg);
            this.setState({
              msg: "",
            });
          }}
        >
          확인
        </button>
      </div>
    );
  }
}

export default EventComponent;
```

## 3. 임의 메서드 만들기

- 이벤트에 실행할 자바스크립트 코드를 전달하는 것이 아니라, 함수 형태의 값을 전달한다.
- 그렇기에 이벤트를 처리할 때 렌더링을 하는 동시에 함수를 만들어서 전달해 주었다. 이 방법 대신 함수를 미리 준비하여 전달하는 방법도 있다. 성능상으로는 차이가 거의 없지만, 가독성은 훨씬 높다.

```tsx
import React from "react";

class EventComponent extends React.Component {
  state = {
    msg: "",
  };

  **// 해당 클래스에 바인딩 해주는 작업이 필요하다.**
  **constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }**

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      msg: e.target.value,
    });
  }

  handleClick() {
    alert(this.state.msg);
    this.setState({
      msg: "",
    });
  }

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="message"
          placeholder="아무거나 입력해 보세요"
          value={this.state.msg}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>확인</button>
      </div>
    );
  }
}

export default EventComponent;
```

- **함수가 호출될 때 this는 호출부에 따라 결정**되므로, **클래스의 임의 메서드가 특정 HTML 요소의 이벤트로 등록되는 과정에서 메서드와 this의 관계가 끊어져 버린다.** 이 때문에 **임의 메서드가 이벤트로 등록되어도 this를 컴포넌트 자신으로 제대로 가리키기 위해서는 메서드를 this와 바인딩(binding)하는 작업이 필요**하다.

## 4. input 여러 개 다루기

- state를 일일이 하나씩 만드는 것도 하나의 해법이지만, 매우 비효율적이다.
- 이 때, event 객체를 활용하면 되는데, [e.target.name](http://e.target.name) 값을 사용하면 된다. onChange 이벤트를 핸들러에서 e.target.name은 해당 인풋의 name을 가리킨다.

```tsx
import React from "react";

class EventComponent extends React.Component {
  state = {
    username: "",
    msg: "",
  };

  // 해당 클래스에 바인딩 해주는 작업이 필요하다.
  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  **handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }**

  handleClick() {
    alert(this.state.username + ": " + this.state.msg);
    this.setState({
      username: "",
      msg: "",
    });
  }

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="username"
          placeholder="사용자명"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="msg"
          placeholder="아무거나 입력해 보세요"
          value={this.state.msg}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>확인</button>
      </div>
    );
  }
}

export default EventComponent;
```

- 객체 안에서 ket를 [ ]로 감싸면 그 안에 넣은 레퍼런스가 가리키는 실제 값이 key 값으로 사용된다.

```tsx
const name: string = "variantKey";
const object = {
  [name]: "value",
};
```

```json
{
  "variantKey": "value"
}
```

## 5. onKeyPress 이벤트 핸들링

```tsx
handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    this.handleClick();
  }
}
```

# 3. 함수형 컴포넌트로 구현해 보기

```tsx
import React, { useState } from "react";

type EventState = {
  username: string;
  msg: string;
};

const FunctionEventComponent: React.FC = (props: any) => {
  const [state, setState] = useState<EventState>({
    username: "",
    msg: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    alert(state.username + ": " + state.msg);
    setState({
      username: "",
      msg: "",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div>
      <h1>이벤트 연습</h1>
      <input
        type="text"
        name="username"
        placeholder="사용자명"
        value={state.username}
        onChange={handleChange}
      />
      <input
        type="text"
        name="msg"
        placeholder="아무거나 입력해 보세요"
        value={state.msg}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleClick}>확인</button>
    </div>
  );
};

export default FunctionEventComponent;
```

# 4. 정리

- 리액트에서 이벤트를 다루는 것은 순수 자바스크립트 또는 jQuery를 사용한 웹 어플리케이션에서 이벤트를 다루는 것과 비슷하다.
- 리액트의 장점 중 하나는 **자바스크립트에 익숙하다면 쉽게 활용할 수 있다는 것**이다. 따라서 기존 HTML DOM Event를 알고 있다면, 리액트의 컴포넌트 이벤트도 쉽게 다룰 수 있다.
