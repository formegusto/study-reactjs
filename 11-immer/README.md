# immer

- 객체의 구조가 엄청나게 깊어지면 불변성을 유지하면서 이를 업데이트하는 것이 매우 힘들다.
- immer 라는 라이브러리는 구조가 복합한 객체도 매우 쉽고 짧은 코드를 사용하여 불변성을 유지하면서 업데이트해 줄 수 있다.

# 1. immer를 설치하고 사용법 알아보기

## 1. usage

```tsx
import produce from "immer";
const nextState = produce(originalState, (draft) => {
  // 바꾸고 싶은 값 바꾸기
  draft.smewhere.deep.inside = 5;
});
```

- 첫 번째 파라미터는 수정하고 싶은 상태이고, 두 번째 파라미터는 상태를 어떻게 업데이트할지 정의하는 함수.
- 두 번째 파라미터로 전달되는 함수 내부에서 원하는 값을 변경하면, produce 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성해 준다.

## 2. example

```tsx
const nextState = produce(originalState, (draft) => {
  // id가 2인 항목의 checked 값을 true로 설정
  const todo = draft.find((t) => t.id === 2);
  todo.checked = true;

  // 배열에 새로운 데이터 추가
  draft.push({
    id: 3,
    todo: "일정 관리 앱에 immer 적용하기",
    checked: false,
  });

  // id 1인 항목을 제거하기
  draft.splice(
    draft.findIndex((t) => t.id === 1),
    1
  );
});
```

## 3. 컴포넌트에 적용하기

```tsx
const onChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    **setForm(
      produce(form, (draft) => {
        draft[name] = value;
      })
    );**
  },
  [form]
);

const onSubmit = useCallback(
  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const info: Data = {
      id: nextId.current,
      name: form.name,
      username: form.username,
    };

    **setData(
      produce(data, (draft) => {
        draft.array.push(info);
      })
    );**

    setForm({
      name: "",
      username: "",
    });

    nextId.current += 1;

    if (usernameRef.current) usernameRef.current.focus();
  },
  [form, data]
);

const onRemove = useCallback(
  (id: number) => {
    **setData(
      produce(data, (draft) => {
        draft.array.splice(
          draft.array.findIndex((d) => d.id === id),
          1
        );
      })
    );**
  },
  [data]
);
```

- immer를 사용하여 컴포넌트 상태를 작성할 때는 객체 안에 있는 값을 직접 수정하거나, 배열에 배열에 직접적인 변화를 일으키는 push, splice 등의 함수를 사용해도 무방하다.
- immer를 사용한다고 해서 무조건 코드가 간결해지지는 않는다. immer는 불변성을 유지하는 코드가 복잡할 때만 사용해도 충분하다.

## 4. useState의 함수형 업데이트와 immer 함께 쓰기

> useState의 함수형 업데이트

- 렌더링을 최적화할 때 쓰이는 방법이다.
- usage

  ```tsx
  const [number, setNumber] = useState(0);
  // prevNumber는 현재 number 값을 가리킨다.
  const onIncrease = useCallback(
    () => setNumber((prevNumber) => prevNumber + 1),
    []
  );
  ```

- example

  ```tsx
  const onRemove = useCallback(
    (id: number) => setTodos(todos.filter((todo) => todo.id !== id)),
    [todos]
  );

  // 내부 prevState 값을 사용하므로, 함수 생성을 방지할 수 있다.
  const onRemove = useCallback(
    (id: number) => setTodos((todos) => todos.filter((todo) => todo.id !== id)),
    []
  );
  ```

- imme에서 제공하는 produce 함수를 호출할 때, 첫 번째 파라미터가 함수 형태라면 업데이트 함수를 반환.

  ```tsx
  const update = (draft) => {
    draft.value = 2;
  };
  const originalState = {
    value: 1,
    foo: "bar",
  };
  const nextState = update(originalState);
  console.log(nextState);
  /*
  	{
  		value: 2,
  		foo: 'bar',
  	}
  	*/
  ```

- 이러한 immer 속성과 useState의 함수형 업데이트를 함께 활용하면 코드를 더욱 깔끔하게 만들 수 있다.

  ```tsx
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      })
    );
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const info: Data = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      setData(
        produce((draft) => {
          draft.array.push(info);
        })
      );

      setForm({
        name: "",
        username: "",
      });

      nextId.current += 1;

      if (usernameRef.current) usernameRef.current.focus();
    },
    [form]
  );

  const onRemove = useCallback((id: number) => {
    setData(
      produce((draft) => {
        draft.array.splice(
          draft.array.findIndex((d) => d.id === id),
          1
        );
      })
    );
  }, []);
  ```

  - prevState가 매개변수 draft로 넘어가서 업데이트 해 줄수 있는 함수형태를 반환한다. setState는 함수형으로 받아서 prevState를 넘긴다.
