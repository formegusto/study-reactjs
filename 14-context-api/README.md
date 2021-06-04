# Context API

- Context API는 리액트 프로젝트에서 전역적으로 사용할 데이터가 있을 때 유용한 기능이다.
- 이를테면 사용자 로그인 정보, 어플리케이션 환경 설정, 테마 등 여러 종류가 있다.
- Context API는 리액트 관련 라이브러리에서도 많이 사용되고 있다.

  ex ) redux, react-router, styled-components 등

# 1. Context API를 사용한 전역 상태 관리 흐름 이해하기

- 리액트 어플리케이션은 컴포넌트 간에 데이터를 props로 전달하기 때문에 컴포넌트 여기저기서 필요한 데이터가 있을 때는 주로 최상위 컴포넌트인 App의 state에 넣어서 관리한다.
- 하지만 위와 같은 방식은 컴포넌트 깊이가 깊어질 수록 유지보수성이 낮아질 가능성이 높아진다.
- 그렇기 때문에 리덕스나 MobX 같은 상태 관리 라이브러리를 사용하여 전역 상태 관리 작업을 더 편하게 처리하기도 하는데, 리액트 v16.3 업데이트 이후에는 Context API가 많이 개선되었기 때문에 별도의 라이브러리를 사용하지 않아도 전역 상태를 손쉽게 관리할 수 있다.

# 2. Context API 사용법

## 1. Context 만들기

```tsx
import { createContext } from "react";

export type ColorType = {
  color: "black";
};

const ColorContext = createContext<ColorType>({ color: "black" });

export default ColorContext;
```

## 2. Consumer 사용하기

- 색상을 Context의 Consumer라는 컴포넌트를 통해 색상을 조회할 것이다.
- 해당 패턴을 Function as a child 혹은 Render Props 라고 한다. 컴포넌트의 children이 있어야 할 자리에 **~~일반 JSX~~** 혹은 **~~문자열~~**이 아닌 **함수를 전달하는 것**이다.

```tsx
function ColorComponent() {
  return (
    <ColorContext.Consumer>
      {(value) => (
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: value.color,
          }}
        />
      )}
    </ColorContext.Consumer>
  );
}
```

- Render Props Exam

  ```tsx
  function RenderPropsSample = ({children}) => {
  	return <div>결과: {children(5)}</div>;
  }

  /*
  	<RenderPropsSample>{value => 2 * value}</RenderPropsSample>;
  */
  ```

  해당 예제는 "결과: 10"을 렌더링한다.

## 3. Provider

- Provider를 사용하면 Context의 value를 변경할 수 있다.
- createContext 함수는 파라미터로 Context의 기본값을 넣어주었다. 이는 Provider를 사용하지 않았을 때만 사용된다. 그러므로 Provider를 사용할 때 value props를 비우면 에러가 발생한다.

```tsx
function App() {
  return (
    <ColorContext.Provider value={{ color: "red" }}>
      <ColorComponent />
    </ColorContext.Provider>
  );
}
```

# 3. 동적 Context 사용하기

## 1. Context 파일 수정하기

- Context의 value에는 무조건 상태 값만 있어야 하는 것은 아니다. 함수를 전달해 줄 수도 있다.

```tsx
export type ColorType = {
  state: {
    color: string;
    subcolor: string;
  };
  actions: {
    setColor: (color: string) => void;
    setSubcolor: (color: string) => void;
  };
};

const ColorContext = createContext<ColorType>({
  state: {
    color: "black",
    subcolor: "red",
  },
  actions: {
    setColor: () => {},
    setSubcolor: () => {},
  },
});

function ColorProvider({ children }: React.PropsWithChildren<any>) {
  const [color, setColor] = useState<string>("black");
  const [subcolor, setSubcolor] = useState<string>("red");

  const value = {
    state: { color, subcolor },
    actions: { setColor, setSubcolor },
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
}

const { Consumer: ColorConsumer } = ColorContext;

export { ColorConsumer, ColorProvider };

export default ColorContext;
```

- ColorContext.Provider 를 이용해 초기값을 설정하는 ColorProvider를 구성하였다.
- createContext의 기본값은 실제 Provider의 value에 넣는 객체의 형태와 일치시켜 주는 것이 좋다. (타입스크립트 만만세다)

## 2. ColorContext 반영하기

```tsx
function App() {
  return (
    <ColorProvider>
      <ColorComponent />
    </ColorProvider>
  );
}
```

```tsx
function ColorComponent() {
  return (
    <ColorConsumer>
      {({ state }) => (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: state.color,
            }}
          />
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: state.subcolor,
            }}
          />
        </>
      )}
    </ColorConsumer>
  );
}
```

## 3. actions 활용하기

```tsx
function SelectComponent() {
  return (
    <div>
      <h2>색상을 선택하세요</h2>
      <ColorConsumer>
        {({ actions }) => (
          <div style={{ display: "flex" }}>
            {colors.map((color, idx) => (
              <div
                key={idx}
                style={{
                  background: color,
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                onClick={() => actions.setColor(color)}
                onContextMenu={(e: React.MouseEvent) => {
                  e.preventDefault(); // 메뉴가 뜨는 것을 방지하기 위함.
                  actions.setSubcolor(color);
                }}
              />
            ))}
          </div>
        )}
      </ColorConsumer>
      <hr />
    </div>
  );
}
```

# 4. Consumer 대신 Hook 또는 static contextType 사용하기

- Context에 있는 값을 사용할 때, Consumer 대신 다른 방식을 사용하여 값을 받아오는 방법

## 1. useContext Hook

- 함수형 컴포넌트에서 Context를 편리하게 사용할 수 있게 해주는 Hook

```tsx
function ColorComponent() {
  const { state } = useContext(ColorContext);

  return (
    <>
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: state.color,
        }}
      />
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: state.subcolor,
        }}
      />
    </>
  );
}
```

## 2. static contextType

- 클래스형 컴포넌트에서 Context를 좀 더 쉽게 사용하는 방법

```tsx
class SelectComponent extends React.Component {
  static contextType = ColorContext;

  render() {
    const { actions } = this.context;

    return (
      <div>
        <h2>색상을 선택하세요</h2>
        <div style={{ display: "flex" }}>
          {colors.map((color, idx) => (
            <div
              key={idx}
              style={{
                background: color,
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
              onClick={() => actions.setColor(color)}
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault(); // 메뉴가 뜨는 것을 방지하기 위함.
                actions.setSubcolor(color);
              }}
            />
          ))}
        </div>
        <hr />
      </div>
    );
  }
}
```

# 5. 정리

- 기존에는 컴포넌트 간에 상태를 교류해야 할 때 무조건 부모 → 자식 흐름으로 props를 통해 전달 해주었지만, Context API를 통해 더욱 쉽게 상태를 교류할 수 있게 됐다.
- 다음 챕터에서 공부해 볼, Redux라는 라이브러리는 Context API 기반으로 만들어졌으며, Context API와 마찬가지로 전역 상태 관리를 도와준다.
- Context API가 개선되기 전까지는 주로 이 Redux라는 라이브러리를 주로 사용해왔다. 하지만 이제는 단순한 전역 상태 관리라면 Context API로 리덕스를 대체할 수도 있다.
- 그러나 Redux는 더욱 향상된 성능과 미들웨어 기능, 강력한 개발자 도구, 코드의 높은 유지 보수성을 제공하기 때문에 모든 상황에 대해 대체가 가능하지는 않다.
