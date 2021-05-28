08_Hooks

# 1. useState

- useState는 가장 기본적인 Hook이며, **함수형 컴포넌트에서도 가변적인 상태**를 지닐 수 있게 해준다.

```tsx
import React, { useState } from "react";

function CounterComponent() {
  const [value, setValue] = useState<number>(0);

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{value}</b>입니다.
      </p>
      <button onClick={() => setValue(value + 1)}>+</button>
      <button onClick={() => setValue(value - 1)}>-</button>
    </div>
  );
}

export default CounterComponent;
```

- useState 함수의 파라미터에는 상태의 기본값을 넣어준다.
- 이 함수가 호출되면 배열을 반환해준다.
  - 첫 번째 원소는 상태 값
  - 두 번째 원소는 상태를 설정하는 함수.

## 1. useState를 여러 번 사용하기

- useState 함수는 하나의 상태 관리 값만 관리할 수 있다.
- 그래서 컴포넌트에서 관리해야 할 상태가 여러 개라면 useState를 여러 번 사용하면 된다.

```tsx
import React, { useState } from "react";

function InfoComponent() {
  **const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");**

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <div>
        <input type="text" value={name} onChange={onChangeName} />
        <input type="text" value={nickname} onChange={onChangeNickname} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
}

export default InfoComponent;
```

# 2. useEffect

- useEffect는 **리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정**할 수 있다.
- 클래스형 컴포넌트의 componentDidMound와 componentDidUpdate를 합친 형태로 보아도 무방하다.

```tsx
import React, { useEffect, useState } from "react";

function InfoComponent() {
	// (...)

  **useEffect(() => {
    console.log("렌더링 Okay");
    console.log("name: ", name);
    console.log("nickname: ", nickname);
  });**

	// (...)
}

export default InfoComponent;
```

스크린샷 2021-05-27 오전 10.40.47![image](https://user-images.githubusercontent.com/52296323/119927537-90d79c80-bfb4-11eb-8408-a74e00266513.png)


## 1. 마운트될 때만 실행하고 싶을 때

```tsx
useEffect(() => {
  console.log("마운트될 때만 실행된다.");
}, []);
```

## 2. 특정 값이 업데이트될 때만 실행하고 싶을 때

```tsx
useEffect(() => {
  console.log("name 이 변화할 때 실행된다. ===> ", name);
}, [name]);
```

## 3. 뒷정리하기 (cleanup)

- useEffect는 기본적으로 렌더링되고 난 직후마다 실행되며, 두 번째 파라미터 배열에 무엇을 넣는지에 따라 실행되는 조건이 달라진다.
- **컴포넌트가 언마운트 되기 전이나 업데이트되기 직전에 어떠한 작업을 수행**하고 싶다면 **useEffect에서 뒷정리(cleanup) 함수를 반환**해 주어야 한다.

```tsx
useEffect(() => {
  console.log("effect");
  console.log(name);
  return () => {
    console.log("clean up");
    console.log(name);
  };
});
```

- 특정 값의 변화전에 뒷정리 함수를 실행하고 싶다면 배열에 해당 State 를 넣어주면 된다.

```tsx
useEffect(() => {
  console.log("effect");
  console.log(name);
  return () => {
    console.log("clean up");
    console.log(name);
  };
}, [name]);
```

- 오직 언마운트 시에만 뒷정리 함수를 호출하고 싶다면 빈 배열을 두번째 파라미터로 넣어주면 된다.

```tsx
useEffect(() => {
  console.log("effect");
  console.log(name);
  return () => {
    console.log("clean up");
    console.log(name);
  };
}, []);
```

## 4. 활용 예제 (가시성)

```tsx
import React, { useState } from "react";
import InfoComponent from "./InfoComponent";

function App() {
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "숨기기" : "보이기"}
      </button>
      {visible && <InfoComponent />}
    </>
  );
}

export default App;
```

# 3. useReducer

- useReducer는 **useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트** 해주고 싶을 때 사용하는 Hook 이다.
- **리듀서(Reducer)는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션(action) 값을 전달받아 새로운 상태를 반환하는 함수**이다.
- 리듀서 함수에서 **새로운 함수를 만들 때는 반드시 불변성**을 지켜주어야 한다.

```tsx
import React, { useReducer } from "react";

type State = {
  value: number;
};

type Action = {
  type: string;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + 1 };
    case "DECREMENT":
      return { value: state.value - 1 };
    default:
      return state;
  }
}

function CounterReducerComponent() {
  const [state, dispatch]: [State, (a: Action) => void] = useReducer(reducer, {
    value: 0,
  });

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{state.value}</b>
      </p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </div>
  );
}

export default CounterReducerComponent;
```

- useReducer의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에는 해당 리듀서의 기본값을 넣어준다.
- **state는 현재 가리키고 있는 상태**고, **dispatch는 액션을 발생시키는 함수**이다. dispatch(action)과 같은 형태로, 함수 안에 파라미터로 액션 값을 넣어 주면 리듀서 함수가 호출되는 구조이다.
- useReducer의 가장 큰 장점은 **컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있다는 것**이다.

## 1. 인풋 상태 관리하기

```tsx
import React, { useReducer } from "react";

type State = {
  name: string;
  nickname: string;
};

function reducer(state: State, e: React.ChangeEvent<HTMLInputElement>) {
  return {
    ...state,
    [e.target.name]: e.target.value,
  };
}

function InfoReducerComponent() {
  const [state, dispatch]: [
    State,
    (e: React.ChangeEvent<HTMLInputElement>) => void
  ] = useReducer(reducer, { name: "", nickname: "" });

  return (
    <div>
      <div>
        <input name="name" type="text" value={state.name} onChange={dispatch} />
        <input
          name="nickname"
          type="text"
          value={state.nickname}
          onChange={dispatch}
        />
      </div>
      <div>
        <div>
          <b>이름:</b> {state.name}
        </div>
        <div>
          <b>닉네임:</b> {state.nickname}
        </div>
      </div>
    </div>
  );
}

export default InfoReducerComponent;
```

- **useReducer에서의 액션은 그 어떤 값도 사용 가능하다.**

# 4. useMemo

```tsx
import React, { useState } from "react";

const getAverage = (nums: number[]): number => {
  console.log("평균값 계산 중..");
  return nums.reduce((cur, num) => cur + num / nums.length, 0);
};

function AverageComponent() {
  const [nums, setNums] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onClick = () => {
    setNums(nums.concat(parseInt(input)));
    setInput("");
  };

  return (
    <div>
      <input value={input} type="text" onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>
        {nums.map((num, idx) => (
          <li key={idx}>{num}</li>
        ))}
      </ul>
      <h1>평균값: {getAverage(nums)}</h1>
    </div>
  );
}

export default AverageComponent;
```

- 콘솔창을 보면 인풋 내용을 수정할 때도 함수가 실행되는 것을 확인할 수 있다.
- 이럴 때 useMemo Hook을 사용하면 최적화를 할 수 있다.

```tsx
function AverageComponent() {
  // (...)

  **const avg = useMemo(() => getAverage(nums), [nums]);**

  return (
    <div>
      <input value={input} type="text" onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>
        {nums.map((num, idx) => (
          <li key={idx}>{num}</li>
        ))}
      </ul>
      <h1>평균값: {avg}</h1>
    </div>
  );
}

export default AverageComponent;
```

- nums의 내용이 바뀔 때만 getAverage 함수가 호출된다.

# 5. useCallback

- 이 Hook을 사용하면 **이벤트 핸들러 함수를 필요할 때만 생성**할 수 있다.

```tsx
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setInput(e.target.value);
};

const onClick = () => {
  setNums(nums.concat(parseInt(input)));
  setInput("");
};
```

- 위와 같이 함수를 선언하면 컴포넌트가 리렌더링될 때마다 이 함수들이 새로 생성된다.
- 컴포넌트의 렌더링이 자주 발생하거나 렌더링해야 할 컴포넌트의 개수가 많아지면 이 부분을 최적화해 주는 것이 좋다.

```tsx
import React, { useCallback, useMemo, useState } from "react";

const getAverage = (nums: number[]): number => {
  console.log("평균값 계산 중..");
  return nums.reduce((cur, num) => cur + num / nums.length, 0);
};

function AverageComponent() {
  const [nums, setNums] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");

  **const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []); // 컴포넌트가 처음 렌더링될 때만 함수 생성

  const onClick = useCallback(() => {
    setNums(nums.concat(parseInt(input)));
    setInput("");
  }, [nums, input]); // number 혹은 list가 바뀌었을 때만 함수 생성**

	// (...)
}

export default AverageComponent;
```

- useCallback의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 된다. 이 배열에는 어떤 값이 바뀌었을 때 함수를 새로 생성해야 하는지 명시한다.
- **함수 내부에서 상태 값에 의존해야 할 때는 그 값을 반드시 두 번째 파라미터 안에 포함**시켜 주어야 한다.

```tsx
useCallback(() => {
  console.log("hello world!");
}, []);

useMemo(() => {
  const fn = () => {
    console.log("hello world!");
  };
}, []);
```

- 위에 두 코드는 완전히 똑같다. useCallback은 결국 useMemo로 함수를 반환하는 상황에서 더 편하게 사용할 수 있는 Hook이다.
- **숫자, 문자열, 객체처럼 일반 값을 재사용하려면 useMemo를 사용하고, 함수를 재사용하려면 useCallback을 사용한다.**

# 6. useRef

```tsx
import React, { useCallback, useMemo, useRef, useState } from "react";

const getAverage = (nums: number[]): number => {
  console.log("평균값 계산 중..");
  return nums.reduce((cur, num) => cur + num / nums.length, 0);
};

function AverageComponent() {
  const [nums, setNums] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");
  **const inputEl: React.Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);**

	// (...)

  const onClick = useCallback(() => {
    setNums(nums.concat(parseInt(input)));
    setInput("");
    **if (inputEl.current) inputEl.current.focus();**
  }, [nums, input]); // number 혹은 list가 바뀌었을 때만 함수 생성

	// (...)

  return (
    <div>
      **<input value={input} type="text" onChange={onChange} ref={inputEl} />**
      <button onClick={onClick}>추가</button>
      <ul>
        {nums.map((num, idx) => (
          <li key={idx}>{num}</li>
        ))}
      </ul>
      <h1>평균값: {avg}</h1>
    </div>
  );
}

export default AverageComponent;
```

## 1. 로컬 변수 사용하기

- 로컬 변수를 사용해야 할 때도 useRef를 활용할 수 있다. 여기서 로컬 변수는 렌더링과 상관없이 바뀔 수 있는 값을 의미한다.

### 1. 클래스형 컴포넌트

```tsx
class MyComponent extends React.Component {
  id = 1;
  setId = (n) => {
    this.id = n;
  };
  printId = () => {
    console.log(this.id);
  };
  render() {
    return <div>MyComponent</div>;
  }
}

export default MyComponent;
```

### 2. 함수형 컴포넌트

```tsx
function RefSample() {
  const id: number = useRef<number>(1);
  const setId = (n) => {
    id.current = n;
  };
  const printId = () => {
    console.log(id.current);
  };
  return <div>RefSample</div>;
}

export default RefSample;
```

- ref 안의 값이 바뀌어도 컴포넌트는 렌더링되지 않는다. 렌더링과 관련되지 않은 값을 관리할 때만 이러한 방식으로 코드를 작성한다.

# 7. 커스텀 Hooks 만들기

```tsx
import React, { useReducer } from "react";

function reducer<S>(state: S, e: React.ChangeEvent<any>): S {
  return {
    ...state,
    [e.target.name]: [e.target.value],
  };
}

export default function useInputs<S>(initState: S): [S, typeof onChange] {
  const [state, dispatch] = useReducer(reducer, initState);

  const onChange = (e: React.ChangeEvent<any>) => {
    dispatch(e);
  };

  return [state as S, onChange];
}
```

# 8. 다른 Hooks

- 커스텀 Hooks를 만들어서 사용했던 것처럼, 다른 개발자가 만든 Hooks도 라이브러리로 설치하여 사용할 수 있다.

[Collection of React Hooks](https://nikgraf.github.io/react-hooks/)

[rehooks/awesome-react-hooks](https://github.com/rehooks/awesome-react-hooks)

# 9. 정리

- 리액트에서 Hooks 패턴을 사용하면 클래스형 컴포넌트를 작성하지 않고도, 대부분의 기능을 구현할 수 있다.
- **매뉴얼에서는 새로 작성하는 컴포넌트의 경우, 함수형 컴포넌트와 Hooks를 사용할 것을 권장**하고 있다.
- 함수형 컴포넌트의 사용을 첫 번째 옵션으로 두고, 꼭 필요한 상황에서만 클래스형 컴포넌트를 구현하도록 하자.
