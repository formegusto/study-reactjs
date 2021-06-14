# Code Splitting

- 리액트 프로젝트를 완성하여 사용자에게 제공할 때는 빌드 작업을 거쳐서 배포해야 한다.
- 빌드 작업을 통해 프로젝트에서 사용되는 자바스크립트 파일 안에서 불필요한 주석, 경고 메시지, 공백 등을 제거하여 파일 크기를 최소화하기도 하고, 브라우저에서 JSX 문법이나 다른 최신 자바스크립트 문법이 원활하게 실행되도록 코드의 트랜스파일 작업도 할 수 있다.
- 만약 프로젝트 내에 이미지와 같은 정적 파일이 있다면 해당 파일을 위한 경로도 설정된다.

  → **이 작업은 웹팩(webpack)이라는 도구가 담당**한다.

  **웹팩에서 별도의 설정을 하지 않으면 프로젝트에서 사용 중인 모든 자바스크립트는 파일이 하나의 파일로 합쳐지고, 모든 CSS 파일도 하나의 파일로 합쳐진다.**

- CRA로 프로젝트를 빌드할 경우 최소 2 개 이상의 자바스크립트 파일이 생성되는데, CRA의 기본 웹팩 설정에는 SplitChunks라는 기능이 적용되어 node_modules에서 불러온 파일, 일정 크기 이상의 파일, 여러 파일 간에 공유된 파일을 자동으로 따로 분리시켜서 캐싱의 효과를 제대로 누릴 수 있게 해준다.

![Untitled](https://user-images.githubusercontent.com/52296323/121828022-39963380-ccf9-11eb-86d8-a805a99e0296.png)

- 파일 이름에는 모두 해시값이 포함되어 있다.
- 2로 시작하는 파일에는 React, ReactDOM 등 node_modules에서 불러온 라이브러리 관련 코드가 들어있다.
  - 웹팩의 SplitChunks 기능을 통해 자주 바뀌지 않는 코드들이 2로 시작하는 파일에 들어 있기 때문에 캐싱의 이점을 더 오래 누릴 수 있다.
- main으로 시작하는 파일에는 직접 프로젝트에 작성하는 App같은 컴포넌트에 대한 코드가 들어 있다.

```jsx
(this["webpackJsonp17-code-splitting"] =
  this["webpackJsonp17-code-splitting"] || []).push([
  [0],
  {
    11: function (e, t, n) {
      "use strict";
      n.r(t);
      var c = n(1),
        s = n.n(c),
        r = n(3),
        a = n.n(r),
        i = (n(8), n.p + "static/media/logo.6ce24c58.svg"),
        o = (n(9), n(0));
      var l = function () {
          return Object(o.jsx)("div", {
            className: "App",
            children: Object(o.jsxs)("header", {
              className: "App-header",
              children: [
                Object(o.jsx)("img", {
// ...
```

> App 컴포넌트를 수정하고 다시 빌드해보자

![Untitled 1](https://user-images.githubusercontent.com/52296323/121828030-4024ab00-ccf9-11eb-8c19-b8f8c2139947.png)

- node_modules 불러온 라이브러리가 들어 있던 2로 시작하는 파일의 이름은 바뀌지 않았고, 작성하는 컴포넌트 관련 코드가 들어 있던 main으로 시작하는 파일의 이름은 바뀐 것을 확인할 수 있다.

> 다음과 같이 파일을 분리하는 작업을 코드스플리팅이라고 한다.

- 프로젝트에 기본 탑재된 SplitChunks기능을 통한 코드 스플리팅은 단순히 효율적인 캐싱 효과만 있을 뿐
- 실제로 사용자가 웹 페이지에 접속했을 때, 필요한 페이지가 A라고 친다면, 다음과 같이 main에 작성된 컴포넌트의 모든 내용이 있으면 B랑 C의 내용도 포함된 main 파일이 사용자에게 보내진다. 즉, 필요하지 않은 페이지가 전송된다.
- 리액트 프로젝트에서 별도로 설정하지 않으면 이렇게 A,B,C 컴포넌트에 대한 코드가 모두 main에 저장되어 버린다. 만약 어플리케이션의 규모가 커지면 지금 당장 필요하지 않은 컴포넌트 정보도 모두 불러오면서 파일 크기가 매우 커진다.

> 이러한 문제점을 해결해 줄 수 있는 방법이 바로 코드 비동기 로딩이다. 코드 비동기 로딩을 통해 자바스크립트 함수, 객체, 혹은 컴포넌트를 처음에는 불러오지 않고, 필요한 시점에 불러와서 사용할 수 있다.

# 1. 자바스크립트 함수 비동기 로딩

```tsx
// notify.ts 작성
export default function notify() {
  alert("안녕하세요!");
}
```

```tsx
function App() {
  const onClick = () => {
    notify();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
      </header>
    </div>
  );
}
```

- 다음과 같이 코드를 작성하면 notify 코드가 main 파일 안에 들어가게 된다.

```tsx
// main.[hash].js
var r = function () {
  return Object(l.jsx)("div", {
    className: "App",
    children: Object(l.jsxs)("header", {
      className: "App-header",
      children: [
        Object(l.jsx)("img", {
          src: a,
          className: "App-logo",
          alt: "logo",
        }),
        Object(l.jsx)("p", {
          onClick: function () {
            alert("\uc548\ub155\ud558\uc138\uc694!");
          },
          children: "Hello React!",
        }),
      ],
    }),
  });
};
```

- 아래와 같이 onClick의 내용을 수정해보자

```tsx
const onClick = () => {
  import("./notify").then((result) => result.default());
};
```

- import를 함수로 사용하면 Promise를 반환한다. 이렇게 import 함수로 사용하는 문법은 아직 표준 자바스크립트가 아니지만, stage-3 단계에 있는 dynamic import라는 문법이다. 현재는 웹팩에서 지원하고 있으므로 별도의 설정 없이 프로젝트에 바로 사용할 수 있다.
- 이 함수를 통해 모듈을 불러올 때, 모듈에서 default로 내보낸 것은 result.default를 참조해야 사용할 수 있다.

```tsx
Object(a.jsx)("p", {
  onClick: function () {
    n.e(3)
      .then(n.bind(null, 12))
      .then(function (e) {
        return e.default();
      });
  },
  children: "Hello React!",
}),
```

- notify의 함수 내용이 아닌, 다른 내용으로 변했다.
- 또한 개발자 모드의 Network 탭에서 확인해보면, p 태그를 클릭하는 시점에서 js 파일을 불러오는 것을 볼 수 있다.
- 이렇게 notify 관련 코드들은 3으로 시작하는 파일에 들어있는 것을 확인할 수 있을 것이다.

```tsx
(this["webpackJsonp17-code-splitting"] =
  this["webpackJsonp17-code-splitting"] || []).push([
  [3],
  {
    12: function (t, n, i) {
      "use strict";
      function s() {
        alert("\uc548\ub155\ud558\uc138\uc694!");
      }
      i.r(n),
        i.d(n, "default", function () {
          return s;
        });
    },
  },
]);
//# sourceMappingURL=3.a4f11fcb.chunk.js.map
```

# 2. React.lazy와 Suspense를 통한 컴포넌트 코드 스플리팅

- 코드 스플리팅을 위해 리액트에 내장된 기능으로 유틸 함수인 React.lazy와 컴포넌트인 Suspense가 있다.
- 해당 기능은 리액트 16.6 버전부터 도입되었다. 이전 버전에서는 import 함수를 통해 불러온 다음, 컴포넌트 자체를 state에 넣는 방식으로 구현해야 한다.

## 1. state를 사용한 코드 스플리팅

```tsx
function App() {
  const [splitComponent, setSplitComponent] = useState<ReactElement>();

  const handleClick = async () => {
    const loadedModule = await import("./SplitMe");
    setSplitComponent(loadedModule.default);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={handleClick}>Hello React!</p>
        {splitComponent}
      </header>
    </div>
  );
}
```

- Network 탭을 확인해보면, 버튼이 클릭됐을 때, 컴포넌트 파일이 불러와지는 것을 확인할 수 있다.
- state를 사용하여 컴포넌트 코드 스플리팅을 하는 것이 그렇게 어렵지는 않지만, 매번 state에 선언해 주어야 한다는 점이 조금 불편하다.

## 2. React.lazy와 Suspense 사용하기

- React.lazy는 컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해주는 유틸 함수이다.

```tsx
const SplitMe = React.lazy(() => import("./SplitMe"));
```

- Suspense는 리액트 내장 컴포넌트로서 코드 스플리팅된 컴포넌트를 로딩하도록 발동시킬 수 있고, 로딩이 끝나지 않았을 때 보여줄 UI를 설정할 수 있다.

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <SplitMe />
</Suspense>
```

```tsx
function App() {
  const [visible, setVisible] = React.useState<boolean>(false);

  const onClick = () => {
    setVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick}>Hello React!</p>
        <Suspense fallback={<div>Loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </header>
    </div>
  );
}
```

- 개발자 도구에서 네트워크 속도를 낮추고, p 태그를 클릭하면 로딩 문구가 뜨다가 컴포넌트가 등장하는 것을 볼 수 있다.

## 3. Loadable Components를 통한 코드 스플리팅

- Loadable Components는 코드 스플리팅을 편하게 하도록 도와주는 서드파티 라이브러리이다. 이 라이브러리의 이점은 서버 사이드 렌더링을 지원한다는 것이다. (React.lazy와 Suspense는 지원하지 않는다.)
- 또한, 렌더링하기 전에 필요할 때 스플리팅된 파일을 미리 불러올 수 있는 기능도 있다.
- SSR(Server Side Rendering)?
  - 웹 서비스의 초기 로딩 속도 개선, 캐싱 및 검색 엔진 최적화를 가능하게 해 주는 기술이다.
  - 이를 사용하면 웹 서비스의 초기 렌더링을 사용자의 브라우저가 아닌, 서버 쪽에서 처리한다.
  - 사용자는 서버에서 렌더링한 html 결과물을 그대로 받아와서 쓰기 때문에 초기 로딩 속도도 개선되고, 검색 엔진에서 크롤링할 때도 문제없다.
- yarn add @loadable/component

```tsx
function App() {
  const [visible, setVisible] = React.useState<boolean>(false);

  const onClick = () => {
    setVisible(true);
  };

  const onMouseOver = () => {
    SplitMe.preload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p onClick={onClick} onMouseOver={onMouseOver}>
          Hello React!
        </p>
        {visible && <SplitMe />}
      </header>
    </div>
  );
}
```

- loadable의 장점은 preload(미리불러오기)가 있다는 점인데, onMouseOver, 즉, 사용자가 클릭전에 마우스를 올렸을 때 js 파일을 불러오게 한 후 클릭 이벤트를 적용하면 사용자에게 더 좋은 경험을 제공해줄 수 있다.
- loadable은 preload 기능 외에도 타임아웃, 로딩 UI 딜레이, 서버 사이트 렌더링 호환 등 다양한 기능을 제공해준다.

# 3. 정리

- 서버사이드렌더링을 할 계획이 없다면 React.lazy와 Suspense로 구현하고, 계획이 있다면 Loadable Components를 사용해야 한다.
- 리액트 공식 문서에서도 서버사이드렌더링을 할 경우 Loadable Components 라이브러리르 사용하도록 권장하고 있다.
