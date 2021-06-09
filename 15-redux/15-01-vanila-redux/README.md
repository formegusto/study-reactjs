# 리액트 없이 쓰는 리덕스

- 리덕스는 리액트에 종속되는 라이브러리가 아니다. 리액트에서 사용하려고 만들어졌지만 실제로 다른 UI 라이브러리/프레임워크와 함께 사용할 수도 있다.

## 1. Parcel로 프로젝트 만들기

- Parcel이라는 도구를 사용하면 아주 빠르게 웹 어플리케이션 프로젝트를 구성할 수 있다.
- yarn global add parcel-bundler
- parcel index.html 로 서버를 열 수 있다.
- yarn add redux

## 2. 액션 타입과 액션 생성 함수 정의

> 액션이란, 프로젝트의 상태에 변화를 일으키는 것을 말한다. 주로 대문자 형태로 작성하며, 이름은 고유해야 한다.

```jsx
const divToggle = document.querySelector(".toggle");
const counter = document.querySelector("h1");
const btnIncrease = document.querySelector("#increase");
const btnDecrease = document.querySelector("#decrease");

const TOGGLE_SWITCH = "TOGGLE_SWITCH";
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";
```

> 액션 생성 함수란 액션 객체를 만드는 함수이다.

```jsx
const toggleSwitch = () => ({ type: TOGGLE_SWITCH });
const increase = (diff) => ({ type: INCREASE, diff });
const decrease = () => ({ type: DECREASE });
```

## 3. 초깃값 설정

> 스토어의 initialState를 설정한다.

```jsx
const initialState = {
  toggle: false,
  counter: 0,
};
```

## 4. 리듀서 함수 정의

> 리듀서는 변화를 일으키는 함수이다.

```jsx
function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state,
        toggle: !state.toggle,
      };
    case INCREASE:
      return {
        ...state,
        counter: state.counter + action.diff,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
}
```

- 리듀서 함수가 맨 처음 호출될 때는 state 값이 undefined이다. 해당 값이 undefined로 주어졌을 때는 initialState를 기본값으로 설정하기 위해 함수의 파라미터 쪽에 기본값이 설정되어 있다.
- 객체의 구조가 복잡해지거나 배열도 함께 다루는 경우 immer 라이브러리를 사용하면 좀 더 쉽게 리듀서를 작성할 수 있다.

## 5. 스토어 만들기

> 스토어를 만들때는 redux 라이브러리의 createStore 라는 함수를 사용한다. 인자로 reducer 함수를 넘겨준다.

```jsx
import { createStore } from "redux";

// (...)

const store = createStore(reducer);
```

## 6. render 함수 만들기

- 상태가 업데이트 될 때마다 호출하여 UI의 속성을 변경 시킨다.

```jsx
const render = () => {
  const state = store.getState(); // 현재 상태를 불러온다.
  // 토글 처리
  if (state.toggle) {
    divToggle.classList.add("active");
  } else {
    divToggle.classList.remove("active");
  }

  // 카운터 처리
  counter.textContent = state.counter;
};

render();
```

## 7. 구독하기

- 상태가 바뀔 때마다 render 함수가 호출되도록 구독해줄 것이다.
- 후에 react에서 사용할 react-redux라는 라이브러리는 이 작업을 대신해주기 때문에 구독을 할 필요가 없다.
- 근본은 원래는 subscribe를 사용해줘야 했다는 점

```jsx
store.subscribe(render);
```

## 8. 액션 발생시키기

```jsx
divToggle.onclick = () => {
  store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
  store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
  store.dispatch(decrease());
};
```
