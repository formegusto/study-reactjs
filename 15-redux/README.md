# Redux

- 리액트 v16.3 이후 많은 개선이 이루어진 ContextAPI를 사용하는 것만으로도 단순히 전역 상태를 관리할 수 있다.
- 하지만 프로젝트의 규모가 커질경우 리덕스를 사용하는 편이 좋다. 코드의 유지보수성을 높여 주고, 작업 효율도 극대화해 주기 때문이다. 추가로 편리한 개발자 도구를 지원하고, 미들웨어라는 기능을 제공하여 비동기 작업을 훨씬 효율적으로 관리할 수 있게 해주기도 한다.

# 1. 개념

## 1. 액션

- 상태에 어떠한 변화가 필요하면 액션(action)이란 것이 발생한다. 이는 하나의 객체로 표현되는데, 액션 객체는 다음과 같은 형식으로 이루어져있다.

  ```tsx
  {
    type: "TOGGLE_VALUE";
  }
  ```

- 액션 객체는 type필드를 반드시 가지고 있어야 한다. 이 값을 액션의 이름이라고 생각하면 되고, 그 외의 값들은 나중에 상태 업데이트를 할 때 참고해야 할 값이며, 작성자 마음대로 넣을 수 있다.

## 2. 액션 생성 함수

- 액션 생성 함수(action creator)는 액션 객체를 만들어 주는 함수이다.

  ```tsx
  function addTodo(data) {
  	reutnr {
  		type: 'ADD_TODO',
  		data
  	}
  }
  ```

## 2. 리듀서

- 리듀서(reducer)는 변화를 일으키는 함수이다. 액션을 만들어서 발생시키면 리듀서가 현재 상태와 전달받은 액션 객체를 파라미터로 받아온다.
- 그리고 두 값을 참고하여 새로운 상태를 만들어서 반환해준다.

  ```tsx
  const initialState = {
    counter: 1,
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case INCREMENT:
        return {
          counter: state.counter + 1,
        };
      default:
        return state;
    }
  }
  ```

## 4. 스토어

- 프로젝트에 리덕스를 적용하기 위해 스토어(store)를 만드는데, 한 개의 프로젝트는 단 하나의 스토어만 가질 수 있고, 스토어 안에는 현재 어플리케이션 상태와 리듀서가 들어가 있다.
- 그 외에도 몇 가지 중요한 내장 함수를 지닌다.

## 5. 디스패치

- 디스패치(dispatch)는 스토어의 내장 함수 중 하나이다. 디스패치는 액션을 발생시키는 것이라고 이해하면 된다.
- 이 함수는 dispatch(action)과 같은 형태로 액션 객체를 파라미터로 넣어서 호출한다.

## 6. 구독

- 구독(subscribe)도 스토어의 내장 함수 중 하다.
- subscribe 함수 안에 리스너 함수를 파라미터로 넣어서 호출해주면, 이 리스너 함수가 액션이 디스패치되어 상태가 업데이트될 때마다 호출된다.

# 3. 리덕스의 세 가지 규칙

## 1. 단일 스토어

- 여러 개의 스토어를 사용하는 것이 완전히 불가능하지는 않지만, 상태 관리가 복잡해질 수 있기 때문에 권장하지 않는다.

## 2. 읽기 전용 상태

- 리덕스에서 불변성을 유지해야 하는 이유는 내부적으로 데이터가 변경되는 것을 감지하기 위해 얕은 비교(shallow equality) 검사를 하기 때문이다. 객체의 변화를 감지할 때, 객체의 깊숙한 안쪽까지 비교하는 것이 아니라 겉핥기 식으로 비교하여 좋은 성능을 유지할 수 있는 것이다.

## 3. 리듀서는 순수한 함수

> 순수한 함수의 조건

- 리듀서 함수는 이전 상태와 액션 객체를 파라미터로 받는다.
- 파라미터 외의 값에는 의존하면 안된다.
- 이전 상태는 절대로 건드리지 않고, 변화를 준 새로운 상태 객체를 만들어서 반환한다.
- 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과 값을 반환한다.
