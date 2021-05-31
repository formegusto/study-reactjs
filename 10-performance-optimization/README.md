# 컴포넌트 성능 최적화

# 1. 많은 데이터 렌더링하기

```tsx
import React from 'react';
import TodoComponent from '../components/TodoComponent';
import useTodos, { Todo } from '../hooks/useTodos';

const ManyTodosGenerator = (): Todo[] => {
  const todos = [];
  for (let i = 1; i <= 2500; i++)
    todos.push({
      id: i,
      text: `할 일 ${i}`,
      checked: false,
    });
  return todos;
};

function TodoContainer() {
  const { todos, onInsert, onDelete, onToggle } = useTodos(ManyTodosGenerator);

  return (
    <TodoComponent
      todos={todos}
      onInsert={onInsert}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}

export default TodoContainer;
```

- useState를 사용할 경우에는 기본값에 함수실행문이 아닌, 함수를 넣어주면 컴포넌트가 처음 렌더링 될 때만 해당 함수가 실행된다고 한다.

# 2. 크롬 개발자 도구를 통한 성능 모니터링

- Tab : Performance

  → Record 버튼을 누르고 할 일을 아무거나 체크해보자.

- React Profiler에서도 확인 가능하다.

# 3. 느려지는 원인 분석

- 컴포넌트 리렌더링이 발생하는 상황을 다시 리마인드해보자.
- 할 일을 체크할 경우, TodoContainer의 state가 변경되면서 리렌더링 된다. 그리고 TodoComponent → TodoList → 무수히 많은 Component 들이 리렌더링된다.
- 토글된 할일은 리렌더링되어야 하는 것이 맞지만, 다른 할 일 들은 리렌더링을 안 해도 되는 상황인데 모두 리렌더링되고 있으므로 성능 저하가 발생한 것이다.
- 여기서 리렌더링 성능을 최적화해 주는 작업을 해 주어야 한다. 즉, 리렌더링이 불 필요할 때는 리렌더링을 방지해 주어야 한다.

# 4. React.memo를 사용하여 컴포넌트 성능 최적화

- 컴포넌트의 렌더링을 방지할 때는 'shouldComponentUpdate'라는 라이프사이클을 사용하면 된다.
- 하지만 함수형 컴포넌트에서는 사용할 수 없으므로, 이 때 React.memo라는 함수를 사용한다.
- 컴포넌트의 props가 바뀌지 않았다면, 리렌더링하지 않도록 설정하여 함수형 컴포넌트의 리렌더링 성능을 최적화해줄 수 있다.

```tsx
export default React.memo(TodoListItem);
```

# 5. onToggle, onRemove 함수가 바뀌지 않게 하기

- 기존에 내가 짠 코드는 ListItem에서 useReducer를 통해 받은 함수를 사용하게 해줬다.
- 하지만 이렇게 할 경우 props에 변경이 생기면 단체로 리렌더링을 해서 위의 React.memo가 소용없는 현상이 발생했다.
- 또한 useTodos 에서 매 렌더링 될 때마다 함수를 생성해서 밑에서 단체로 바뀌는 현상이 발생해버렸다.
- 한 가지 더, useReducer에 3번째 파라미터는 initializer로, 초기 상태를 만들어 주는 함수를 넘겨주면 컴포넌트가 맨 처음 렌더링 될 때만 함수가 호출된다.
- useTodos.ts

  ```tsx
  /*
    usage
      has initState
      useTodos(stateTodos, undefined)
  
      has stateGenerator
      useTodos(undefine, stateGenerator)
  */
  export default function useTodos(
    initialTodos?: Todo[],
    todosGenerator?: () => Todo[],
  ) {
    const [todos, dispatch] = React.useReducer(
      reducer,
      initialTodos,
      todosGenerator!,
    );

    const todoInsert = useCallback((text: string) => {
      dispatch({
        type: INSERT_TODO,
        payload: text,
      });
    }, []);

    const todoDelete = useCallback((id: number) => {
      dispatch({
        type: DELETE_TODO,
        payload: id,
      });
    }, []);

    const todoToggle = useCallback((id: number) => {
      dispatch({
        type: TOGGLE_TODO,
        payload: id,
      });
    }, []);

    return { todos, todoInsert, todoDelete, todoToggle };
  }
  ```

- TodoContainer.tsx

  ```tsx
  function TodoContainer() {
    const { todos, todoInsert, todoDelete, todoToggle } = useTodos(
      undefined,
      ManyTodosGenerator,
    );

    const onInsert = useCallback(
      (text: string) => {
        todoInsert(text);
      },
      [todoInsert],
    );

    const onDelete = useCallback(
      (id: number) => {
        todoDelete(id);
      },
      [todoDelete],
    );

    const onToggle = useCallback(
      (id: number) => {
        todoToggle(id);
      },
      [todoToggle],
    );

    return (
      <TodoComponent
        todos={todos}
        onInsert={onInsert}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    );
  }
  ```

  - Reducer에서는 변화가 없으므로, 초기 렌더링시에만 해당 함수들이 생성된다.

- TodoListItem.tsx

  ```tsx
  function TodoListItem(props: Props) {
    return (
      <div className="TodoListItem">
        <div
          className={cn('checkbox', props.todo.checked && 'checked')}
          onClick={() => props.onToggle(props.todo.id)}
        >
          {props.todo.checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <div className="text">{props.todo.text}</div>
        </div>
        <div className="remove" onClick={() => props.onDelete(props.todo.id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    );
  }
  ```

  - 해당 함수들은 변하지 않고, 자신의 todo에 변화가 생겼을 때만 렌더링이 된다.

# 6. 불변성의 중요성

- 리액트 컴포넌트에서 상태를 업데이트할 때, 불변성을 지키는 것은 매우 중요하다.

```tsx
case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === (action.payload as number)
          ? { ...todo, checked: !todo.checked }
          : todo,
      );
```

- 기존 데이터를 수정할 때, 직접 수정하지 않고, 새로운 배열을 만든 다음에 새로운 객체를 만들어서 필요한 부분을 교체해 주는 방식으로 구현했다.
- 업데이트가 필요한 곳에서는 아예 새로운 배열 혹은 새로운 객체를 만들기 때문에, React.memo를 사용했을 때, props가 바뀌었는지 혹은 바뀌지 않았는지를 알아내서 리렌더링 성능을 최적화해 줄 수 있다.
- 이렇게 기존의 값을 직접 수정하지 않으면서 새로운 값을 만들어 내는 것을 '불변성을 지킨다'고 한다.
- 불변성이 지켜지지 않으면 객체 내부의 값이 새로워져도 바뀐 것을 감지하지 못한다. 그러면 React.memo에서 서로 비교하여 최적화하는 것이 불가능해진다.
- 추가로 전개 연산자(... 문법)를 사용하여 객체나 배열 내부의 값을 복사할 때는 얕은 복사(shallow copy)를 하게 된다. 즉, 내부의 값이 완전히 새로 복사되는 것이 아니라, 가장 바깥쪽에 있는 값만 복사된다. 따라서 내부의 값이 객체 혹은 배열이라면 내부의 값 또한 따로 복사해 주어야 한다.

  → 해당 방법은 배열 혹은 객체의 구조가 정말 복잡해진다면 불변성을 유지하면서 업데이트하는 것도 까다로워진다. 이렇게 복잡한 상황일 경우 immer라는 라이브러리의 도움을 받으면 정말 편하게 작업할 수 있다.

# 7. TodoList 컴포넌트 최적화하기

```tsx
export default React.memo(TodoList);
```

- 현재 TodoList 컴포넌트는 불필요한 리렌더링이 발생하지 않는다.
- 후에 상위 컴포넌트에 state가 추가되어서, 해당 state가 변경될때 TodoList가 리렌더링이 될 수도 있기때문에 넣는다.

# 8. react-virtualized를 사용한 렌더링 최적화

- 위에서 배운 리렌더링 성능 최적화의 핵심은, "필요할 때만 리렌더링 하는 것" 이었다.
- 또 다른 렌더링 성능 최적화 방법이 바로 react-virtualized 이다.

  → 현재 짜여진 View에서는 할 일이 스크롤당 9개씩 보인다.

  → 처음 렌더링될 때 2,500개 컴포넌트 중 2,491개 컴포넌트는 스크롤하기 전에는 보이지 않음에도 불구하고 렌더링이 이루어진다.

  → 또한, todos 배열에 변동이 생길 때에도 TodoList 컴포넌트 내부의 map 함수에서 배열의 처음부터 끝까지 컴포넌트로 변화해 주는데, 이 중에서 2,491개는 보이지 않으므로 시스템 자원 낭비이다.

- react-virtualized를 사용하면 리스트 컴포넌트에서 스크롤되기 전에 보이지 않는 컴포넌트는 렌더링하지 않고, 크기만 차지하게끔 할 수 있다. 그리고 만약 스크롤되면 해당 스크롤 위치에서 보여 주어야 할 컴포넌트를 자연스럽게 렌더링 시킨다.

## 1. 최적화 준비

- react-virtualized를 사용하기 위해서는 각 항목의 실제 크기를 px 단위로 알아내는 선 작업이 필요하다.

  → 개발자 도구로 쉽게 확인 가능하다.

## 2. TodoList 수정

```tsx
import React, { useCallback } from 'react';
import TodoListItem from './TodoListItem';
import { List, ListRowProps } from 'react-virtualized';
import '../styles/TodoList.scss';
import { Todo } from '../hooks/useTodos';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TodoList(props: Props) {
  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      const todo = props.todos[index];
      return (
        <TodoListItem
          todo={todo}
          key={key}
          onDelete={props.onDelete}
          onToggle={props.onToggle}
          style={style}
        />
      );
    },
    [props],
  );

  return (
    <List
      className="TodoList"
      width={512} // 전체 가로 크기
      height={513} // 전체 세로 크기
      rowCount={props.todos.length} // 항목 개수
      rowHeight={57} // 항목 높이
      rowRenderer={rowRenderer} // 항목을 렌더링할 때 쓰는 함수
      list={props.todos} // 배열
      style={{ outline: 'none' }} // 기본적으로 적용되는 outline 스타일 제거
    />
  );
}

export default React.memo(TodoList);
```

- react-virtualized의 List 컴포넌트에서 각 TodoItem을 렌더링할 때 사용하며, 이 함수를 List 컴포넌트의 props로 설정해 주어야 한다.
- 이 함수는 파라미터에 index, key, style 값을 객체 배열로 받아 와서 사용한다.
- List 컴포넌트를 사용할 때는 해당 리스트의 전체 크기와 각 항목의 높이, 각 항목을 렌더링할 때 사용해야 하는 함수, 그리고 배열을 props로 넣어 주어야 한다. 그러면 이 컴포넌트가 전달받은 props를 사용하여 자동으로 최적화 해준다.

## 3. TodoListItem 수정

```tsx
type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  style: React.CSSProperties;
};

function TodoListItem(props: Props) {
  return (
    <div className="TodoListItem-virtualized" style={props.style}>
      <div className="TodoListItem">
        <div
          className={cn('checkbox', props.todo.checked && 'checked')}
          onClick={() => props.onToggle(props.todo.id)}
        >
          {props.todo.checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <div className="text">{props.todo.text}</div>
        </div>
        <div className="remove" onClick={() => props.onDelete(props.todo.id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    </div>
  );
}

export default React.memo(
  TodoListItem,
  (prevProps, nextProps) => prevProps.todo === nextProps.todo,
);
```

- 기존의 보여 주던 내용을 div로 한번 감싸고, 해당 div에는 TodoListItem-virtualized라는 className을 설정해주고, props로 받아온 style을 적용시켜준다.
- 여기서 클래스 네이밍을 만든 이유는 컴포넌트 사이사이에 테두리를 제대로 쳐 주고, 홀수 번째/짝수 번째 항목에 다른 배경 색상을 설정하기 위해서 이다.

# 9. 정리

![10_%E1%84%8F%E1%85%A5%E1%86%B7%E1%84%91%E1%85%A9%E1%84%82%E1%85%A5%E1%86%AB%E1%84%90%E1%85%B3%20%E1%84%89%E1%85%A5%E1%86%BC%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%92%E1%85%AA%2002753cfeb9f8460c8f178e8ddea500ae/Untitled.png](10_%E1%84%8F%E1%85%A5%E1%86%B7%E1%84%91%E1%85%A9%E1%84%82%E1%85%A5%E1%86%AB%E1%84%90%E1%85%B3%20%E1%84%89%E1%85%A5%E1%86%BC%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%92%E1%85%AA%2002753cfeb9f8460c8f178e8ddea500ae/Untitled.png)

- 리액트 컴포넌트의 렌더링은 기본적으로 빠르기 때문에 컴포넌트를 개발할 때, 최적화 작업에 대해 너무 큰 스트레스를 받거나 모든 컴포넌트에 일일이 React.memo를 작성할 필요는 없다.
- 단, 리스트와 관련된 컴포넌트를 만들 때, 보여 줄 항목이 100개 이상이고, 업데이트가 자주 발생한다면, 꼭 최적화를 해주어야 한다.
