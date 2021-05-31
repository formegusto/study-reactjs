# 컴포넌트 반복

> 리액트 프로젝트에서 반복적인 내용을 효율적으로 보여 주고 관리하는 방법

# 1. 자바스크립 배열의 map() 함수

```jsx
arr.map(callback, [thisArg]);
```

- callback : 새로운 배열의 요소를 생성하는 함수로 파라미터는 다음 세 가지 이다.
  - currentValue : 현재 처리하고 있는 요소.
  - index : 현재 처리하고 있는 요소의 index 값.
  - array : 현재 처리하고 있는 원본 배열.
- thisArg(선택항목) : callback 함수 내부에서 사용할 this 레퍼런스

# 2. 데이터 배열을 컴포넌트 배열로 변환하기

## 1. 컴포넌트 수정하기

```tsx
import React from "react";

const IterationComponent: React.FC = () => {
  const names: string[] = ["눈사람", "얼음", "눈", "바람"];
  const nameList: JSX.Element[] = names.map((name, idx) => (
    <li key={idx}>{name}</li>
  ));

  return <ul>{nameList}</ul>;
};

export default IterationComponent;
```

# 3. key

- 리액트에서 key는 **컴포넌트 배열을 렌더링했을 때, 어떤 원소에 변동이 있었는지 알아내려고 사용**한다.
- 예를 들어 유동적인 데이터를 다룰 때는 원소를 새로 생성할 수도, 제거할 수도, 수정할 수도 있다. **key가 없을 때는 Virtual DOM을 비교하는 과정에서 리스트를 순차적으로 비교하면서 변화를 감지**한다.
- **하지만 key가 있다면 이 값을 사용하여 어떤 변화가 일어났는지 더욱 빠르게 알아낼 수 있다.**

## 1. key 설정

- key 값을 설정할 때는 map 함수의 인자로 전달되는 함수 내부에서 컴포넌트 props를 설정하듯이 설정하면 된다. **key 값은 언제나 유일**해야 한다. 따라서 데이터가 가진 고윳값을 key 값으로 설정해야 한다.
- 앞서 예제 컴포넌트에는 이런 고유 번호가 없어서, map 함수에 전달되는 콜백 함수의 인수인 index 값을 사용했다.
- **고유한 값이 없을 때만 index 값을 key로 사용해야 한다. index를 key로 사용하면 배열이 변경될 때 효율적으로 리렌더링하지 못한다.**

# 4. 응용

## 1. 초기 상태 설정하기

```tsx
import React, { useState } from "react";

type IterType = {
  id: number;
  text: string;
};

const IterationComponent: React.FC = () => {
  **const [names, setNames] = useState<IterType[]>([
    {
      id: 1,
      text: "눈사람",
    },
    {
      id: 2,
      text: "얼음",
    },
    {
      id: 3,
      text: "눈",
    },
    {
      id: 4,
      text: "바람",
    },
  ]);**
  **const [text, setText] = useState<string>("");
  const [nextId, setNextId] = useState<number>(5);**

  **const nameList: JSX.Element[] = names.map((name) => (
    <li key={name.id}>{name.text}</li>
  ));

  return <ul>{nameList}</ul>;**
};

export default IterationComponent;
```

## 2. 데이터 추가 기능 구현하기

```tsx
import React, { useState } from "react";

type IterType = {
  id: number;
  text: string;
};

const IterationComponent: React.FC = () => {
	// (...)

  **const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const onClick = () => {
    setNames(
      names.concat({
        id: nextId,
        text: text,
      })
    );
    setNextId(nextId + 1);
    setText("");
  };**

	// (...)

  return (
    <>
      **<input value={text} onChange={onChange} />
      <button onClick={onClick}>추가</button>**
      <ul>{nameList}</ul>
    </>
  );
};

export default IterationComponent;
```

- **리액트에서 상태를 업데이트할 때는 기존 상태를 그대로 두면서 새로운 값을 상태로 설정해야 한다. 이를 불변성 유지라고 하는데, 불변성 유지를 해 주어야 나중에 리액트 컴포넌트의 성능을 최적화**할 수 있다.

## 3. 데이터 제거 기능 구현하기

```tsx
import React, { useState } from "react";

type IterType = {
  id: number;
  text: string;
};

const IterationComponent: React.FC = () => {
	// (...)

  **const onRemove = (id: number) => {
    setNames(names.filter((name) => name.id !== id));
  };

  const nameList: JSX.Element[] = names.map((name) => (
    <li key={name.id} onClick={(e) => onRemove(name.id)}>
      {name.text}
    </li>
  ));**

  return (
    <>
      <input value={text} onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>{nameList}</ul>
    </>
  );
};

export default IterationComponent;
```
