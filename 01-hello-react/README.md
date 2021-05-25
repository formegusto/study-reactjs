# JSX

# 1. 코드 이해하기

```jsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

```jsx
import React from 'react';
```

- 리액트 프로젝트를 만들 때, node_modules 라는 디렉터리도 함께 생성되는데, 프로젝트 생성 과정에서 **node_modules 디렉터리에 react 모듈이 설치**된다. 그리고 이렇게 **import 구문을 통해 리액트를 불러와서 사용**할 수 있다.
- 이렇게 **모듈을 불러와서 사용하는 것**은 원래 브라우저에는 없던 기능이다. **브라우저가 아닌 환경에서 자바스크립트를 실행할 수 있게 해주는 환경인 Node.js에서 지원하는 기능**이다. 참고로 Node.js에서는 import가 아닌, require라는 구문으로 패키지를 불러올 수 있다.
- **이러한 기능을 브라우저에서도 사용하기 위해 번들러(bundler)를 사용**한다. 번들(bundle)은 묶는다는 뜻이다. 즉, 파일을 묶듯이 연결하는 것이다.
- 대표적인 번들러로 웹팩, Parcel, browserify라는 도구들이 있으며, 각 도구마다 특성이 다르다.
- **리액트 프로젝트에서는 주로 웹팩을 사용하는 추세**이다.
- 번들러 도구를 사용하면 import로 모듈을 불러왔을 때 불러온 모듈을 모두 합쳐서 하나의 파일을 생성해 준다. 또 최적화 과정에서 여러 개의 파일로 분리 될 수도 있다.

```jsx
import logo from './logo.svg';
import './App.css';
```

- **웹팩을 사용하면 SVG 파일과 CSS 파일도 불러와서 사용할 수 있다. 이렇게 파일들을 불러오는 것은 웹팩의 로더(loader)라는 기능이 담당**한다.

  → css-loader는 CSS 파일을 불러올 수 있게 해준다.

  → file-loader는 웹 폰트나 미디어 파일 등을 불러올 수 있게 해준다.

  → babel-loader는 자바스크립트 파일들을 불러오면서 최신 자바스크립트 문법으로 작성된 코드를 바벨이라는 도구를 사용하여 ES5 문법으로 변환해준다.

- 웹팩의 로더는 원래 직접 설치하고, 설정해야 하지만 리액트 프로젝트를 만들 때 사용했던 create-react-app이 번거로운 작업을 모두 대신해 주기 때문에 우리는 별도의 설정을 할 필요가 없다.

```jsx
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
```

- **이 코드는 App이라는 컴포넌트를 만들어 준다.** function 키워드를 사용하여 컴포넌트를 만들었는데, 이러한 컴포넌트를 함수형 컴포넌트라고 부른다.
- 프로젝트에서 컴포넌트를 렌더링하면(렌더링이란 '보여 준다'는 것을 의미한다) 함수에서 반환하고 있는 내용을 나타낸다. 함수에서 반환하는 내용을 보면 마치 HTML을 작성한 것 같은데, **이 코드는 HTML도 아니고 문자열 템플릿도 아닌 JSX**이다.

# 2. JSX란?

- **JSX는 자바스크립트의 확장 문법이며 XML과 매우 비슷하게 생겼다.** 이런 형식으로 작성한 코드는 브라우저에서 실행되기 전에 **코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환**된다.

```jsx
function App() {
  return (
    <div>
      Hello <b>react</b>
    </div>
  );
}
```

- 이렇게 작성된 코드는 다음과 같이 변환된다.

```jsx
function App() {
	return React.createElement("div", null, "Hello ", React.createElement("b", null, "react");
}
```

- JSX를 사용하면 매우 편하게 UI를 렌더링할 수 있다.

> JSX도 자바스크립트 문법인가?

- **JSX는 리액트로 프로젝트를 개발할 때 사용되므로, 공식적인 자바스크립트 문법이 아니다.** 바벨에서는 여러 문법을 지원할 수 있도록 preset 및 plugin을 설정한다.
- 바벨을 통해 개발자들이 임의로 만든 문법, 혹은 차기 자바스크립트의 문법들을 사용할 수 있다.

# 3. JSX의 장점

## 1. 보기 쉽고 익숙하다.

- 결국 HTML 코드를 작성하는 것과 비슷하기 때문에 JSX를 사용하는 편이 가독성이 높고 작성하기도 쉽다.

## 2. 더욱 높은 활용도

- JSX에서는 우리가 알고 있는 div나 span 같은 HTML 태그를 사용할 수 있을 뿐만 아니라, 앞으로 만들 컴포넌트도 JSX 안에서 작성할 수 있다.
- **App.tsx 에서 App 컴포넌트가 만들어졌다. src/index.ts 파일에서 이 App 컴포넌트를 마치 HTML 태그 쓰듯이 그냥 작성**한다.

  ```jsx
  import React from 'react';
  import ReactDOM from 'react-dom';
  import './index.css';
  import App from './App';
  import reportWebVitals from './reportWebVitals';

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  ```

  → **ReactDOM.render는 컴포넌트를 페이지에 렌더링하는 역할을 한다.** react-dom 모듈을 불러와 사용할 수 있다. 이 함수의 첫 번째 파라미터에는 페이지에 렌더링할 내용을 JSX 형태로 작성하고, 두 번째 파라미터에는 해당 JSX를 렌더링 할 document 내부 요소를 설정한다.

  → 해당 기본 파일에서는 id가 root인 요소 안에 렌더링을 하도록 설정해놨다. 이 요소는 public/index.html 파일을 열어보면 존재한다.

# 4. JSX 문법

## 1. 감싸인 요소

- 컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다.

```jsx
import React from 'react';

function App() {
  return (
    <h1>리액트 안녕!</h1>
    <h2>잘 작동하니?</h2>
  );
}

export default App;
```

```
SyntaxError: /Users/formegusto/Desktop/formegusto/study/study-reactjs/01-hello-react/src/App.tsx: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (6:4)
```

```jsx
import React from 'react';

function App() {
  return (
    <div>
      <h1>리액트 안녕!</h1>
      <h2>잘 작동하니?</h2>
    </div>
  );
}

export default App;
```

- 이와 같이 요소가 여러개 있는 경우, 부모 요소 하나에 의하여 감싸져야 한다.

  → **이와 같이 요소 여러 개를 왜 하나의 요소로 꼭 감싸주어야 하냐면, Virtual DOM에서 컴포넌트 변화를 감지해낼 때 효율적으로 비교할 수 있도록 컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다는 규칙이 있기 때문**이다.

> Fragment

- 위에서 div 요소를 사용하고 싶지 않을 수도 있다. 그런 경우에는 리액트 v16 이상 부터 도입된 Fragment라는 기능을 사용하면 된다.

```jsx
import React, { Fragment } from 'react';

function App() {
  return (
    <Fragment>
      <h1>리액트 안녕!</h1>
      <h2>잘 작동하니?</h2>
    </Fragment>
  );
}

export default App;
```

- Fragment는 다음과 같이도 표현가능하다.

```jsx
import React from 'react';

function App() {
  return (
    <>
      <h1>리액트 안녕!</h1>
      <h2>잘 작동하니?</h2>
    </>
  );
}

export default App;
```

## 2. 자바스크립트 표현

- JSX 안에서는 자바스크립트 표현식을 쓸 수 있다.
- 자바스크립트 표현식을 작성하려면 JSX 내부에서 코드를 { }로 감싸면 된다.

```jsx
import React from 'react';

function App() {
  const name = '리액트';
  return (
    <>
      <h1>{name} 안녕!</h1>
      <h2>잘 작동하니?</h2>
    </>
  );
}

export default App;
```

## 3. if 문 대신 조건부 연산자

- JSX 내부의 자바스크립트 표현식에서 if 문을 사용할 수는 없다. 하지만 조건에 따라 다른 내용을 렌더링해야 할 때는 JSX 밖에서 if 문을 사용하여 사전에 값을 설정하거나, { } 안에 조건부 연산자를 사용하면 된다.
- TypeScript 특징상 Always false 조건을 컴파일 허용하지 않음.

```jsx
import React from 'react';

function App() {
  let name = '리액트';
  return (
    <>
      {name === '리액트' ? <h1>리액트입니다.</h1> : <h2>리액트가 아닙니다.</h2>}
      <h2>잘 작동하니?</h2>
    </>
  );
}

export default App;
```

## 4. AND 연산자(&&)를 사용한 조건부 렌더링

- 개발하다 보면 특정 조건을 만족할 때 내용을 보여 주고, 만족하지 않을 때 아예 아무것도 렌더링하지 않아야 하는 상황이 올 수 있다. 이럴 때도 조건부 연산자를 통해 구현할 수는 있다.

```jsx
import React from 'react';

function App() {
  let name = '리액트';
  return (
    <>
      {name === '리액트' ? <h1>리액트입니다.</h1> : null}
      <h2>잘 작동하니?</h2>
    </>
  );
}

export default App;
```

- **리액트 컴포넌트에서는 null을 반환하면 아무것도 보여주지 않는다.**
- 이와 같게 and 연산자로 위 코드를 간단하게 표현한다.

```jsx
import React from 'react';

function App() {
  let name = '리액트';
  return (
    <>
      {name === '리액트' && <h1>리액트입니다.</h1>}
      <h2>잘 작동하니?</h2>
    </>
  );
}

export default App;
```

- 해당 코드가 되는 이유는 **리액트에서 false를 렌더링할 때는 null과 마찬가지로 아무것도 나타나지 않기 때문**이다.
- 여기서 한 가지 주의해야 할 점은 **falsy한 값인 0은 예외적으로 화면에 나타난다.**

```jsx
const number = 0;
// 0이 화면에 나타난다.
return number && <div>내용</div>;
```

> JSX를 괄호로 감싸는 경우

- JSX를 여러 줄로 작성할 때 괄호로 감싸고, 한 줄로 표현할 수 있는 JSX는 감싸지 않는다. JSX를 괄호로 감싸는 것은 필수 사항이 아니다. 감싸도 되고, 감싸지 않아도 된다.

## 5. undefined를 렌더링하지 않기

- **리액트 컴포넌트에서는 함수에서 undefined만 반환하여 렌더링하는 상황을 만들면 안된다.**

```jsx
import React from 'react';

function App() {
  const name = undefined;
  return name;
}

export default App;
```

```
/Users/formegusto/Desktop/formegusto/study/study-reactjs/01-hello-react/src/index.tsx
TypeScript error in /Users/formegusto/Desktop/formegusto/study/study-reactjs/01-hello-react/src/index.tsx(9,6):
'App' cannot be used as a JSX component.
  Its return type 'undefined' is not a valid JSX element.
```

- **어떤 값이 undefined일 수도 있다면, OR(||) 연산자를 사용하면 해당 값이 undefined일 때 사용할 값을 지정할 수 있으므로, 간단하게 오류를 방지할 수 있다.**

```jsx
import React from 'react';

function App() {
  const name = undefined;
  return name || <>값이 undefined 입니다.</>;
}

export default App;
```

- **반면 JSX 내부에서 undefined를 렌더링하는 것은 괜찮다.**

```jsx
import React from 'react';

function App() {
  const name = undefined;
  // return name || <>값이 undefined 입니다.</>;
  return <div>{name}</div>;
}

export default App;
```

- name 값이 undefined일 때, 보여 주고 싶은 문구가 있다면 다음과 같이 코드를 작성할 수 있다.

```jsx
import React from 'react';

function App() {
  const name = undefined;
  // return name || <>값이 undefined 입니다.</>;
  return <div>{name || '리액트'}</div>;
}

export default App;
```

## 6. 인라인 스타일링

```jsx
import React, { CSSProperties } from 'react';

function App() {
  const name: string = '리액트';
  const style: CSSProperties = {
    backgroundColor: 'black',
    color: 'aqua',
    fontSize: '48px',
    fontWeight: 'bold',
    padding: 16,
  };
  return <div style={style}>{name}</div>;
}

export default App;
```

- 리액트에서 DOM 요소에 스타일을 적용할 때는 문자열 형태로 넣는 것이 아니라, 객체 형태로 넣어 주어야 한다.
- 표기법은 카멜표기법(camelCase)으로 작성한다.

## 7. class 대신 className

- 일반 HTML 에서 CSS 클래스를 사용할 때는 <div class="myclass"></div> 와 같이 class라는 속성을 설정합니다.
- 하지만 JSX에서는 class가 아닌, className으로 설정해 주어야 한다.
- 이전에는 class로 CSS 클래스를 설정할 때, 오류가 발생하고 CSS 클래스가 적용되지 않았는데, 리액트 v16 이상부터는 class를 className으로 변환시켜 주고 경고를 띄운다.

## 8. 꼭 닫아야 하는 태그

- HTML 코드를 작성할 때 가끔 태그를 닫지 않은 상태로 코드를 작성하기도 한다.
- 예를 들면 input HTML 요소는 <input></input> 이라 입력하지 않고, <input>이라고만 입력해도 작동한다.

```html
<form>
  성: <br />
  <input /><br />
  이름: <br />
  <input />
</form>
```

- JSX에서는 위 코드처럼 태그를 닫지 않으면 오류가 발생한다. (HTML에서는 작동하는 구문)

```jsx
import React from 'react';

function App() {
  const name:string = "리액트";
  return (
    <>
      <div className="react">{name}</div>
      <input>
    </>
  );
}

export default App;
```

```
SyntaxError: /Users/formegusto/Desktop/formegusto/study/study-reactjs/01-hello-react/src/App.tsx: Unterminated JSX contents (9:7)
```

- **태그를 닫아주든, self-closing으로 닫아주든 어쨋든 무조건 닫아주어야 한다.**

```jsx
import React from 'react';

function App() {
  const name: string = '리액트';
  return (
    <>
      <div className="react">{name}</div>
      <input />
    </>
  );
}

export default App;
```

## 9. 주석

- JSX 내부에서 주석을 작성할 때는 {/_ ... _/} 와 같은 형식으로 작성한다. 이렇게 여러 줄로도 작성할 수 있다.
- 시작 태그를 여러 줄로 작성할 때는 그 내부에서 // ... 과 같은 형식의 주석도 작성할 수 있다.

```jsx
import React from 'react';

function App() {
  const name: string = '리액트';
  return (
    <>
      {/* 주석은 이렇게 작성한다. */}
      <div
        className="react" // 시작 태그를 여러 줄로 작성하게 된다면 여기에 주석을 작성할 수 있다.
      >
        {name}
      </div>
      // 하지만 이런 주석이나 /* 이런 주석은 페이지에 그대로 나타나게 된다. */
      <input />
    </>
  );
}

export default App;
```

# 5. ESLint와 Prettier 적용하기

- ESLint는 문법 검사 도구이고, Prettier는 코드 스타일 자동 정리 도구이다.

## 1. ESLint

- 코드를 작성할 때 실수를 하면 에러 혹은 경고 메시지를 VSCode 에디터에서 바로 확인할 수 있게 해준다.

## 2. Prettier

- JSX를 작성할 때는 코드의 가독성을 위해 들여쓰기를 사용한다. 들여쓰기가 제대로 되어 있지 않은 코드는 읽기가 매우 힘들다.

```jsx
import React from 'react';

function App() {
  const name: string = '리액트';
  return (
    <>
      <div className="react">{name}</div>
      <h1>들여쓰기가 이상한</h1>
      <h2>코드</h2>
      <p>입니다.</p>
    </>
  );
}

export default App;
```

- ㅗㅜㅑ;;;
- F1 → format document

  하면 바로 적용된다.

  코드가 자동으로 정렬되고, 세미콜론(;)이 빠진 곳에는 자동으로 세미콜론이 추가된다.

  기존에 사용하던 작음따옴표는 모두 큰따옴표로 바뀌었을 것이다.

  세미콜론은 코드의 뒷부분에 무조건 있어야 하는 문자가 아니다. 이는 단순히 코딩 관습의 차이일 뿐이다. 주로 협업하는 과정에서 정하는 규칙이고, 사람들마다 다른 방식을 사용한다.

- Prettier의 장점은 이러한 스타일을 쉽게 커스터마이징할 수 있다는 것이다.현재 열려 있는 프로젝트의 루트 디렉터리(src, public 디렉터리들이 위치한 곳)에서 .prettierrc 라는 파일을 생성해보자.

  ```json
  {
    "singleQuote": true,
    "semi": true,
    "useTabs": false,
    "tabWidth": 2
  }
  ```

  → 들여쓰기를 할 때 탭 대신 공백을 두 칸 사용하도록 했다. 그리고 큰따옴표 대신 작은 따옴표를 쓰게 했고, 세미콜론은 언제나 붙이도록 설정했다. Prettier는 이 외에에도 다양한 코드 스타일을 사전 설정할 수 있다.

  [Options · Prettier](https://prettier.io/docs/en/options.html)

### 1. 저장할 때 자동으로 코드 정리하기

- 코드 스타일을 정리할 필요가 있을 때마다 F1을 누르기 보다, 혹은 단축키를 입력하는 것보다 더 편한 방식은 저장할 때 자동으로 정리하게 만드는 것이다.
- VSCode → Code → Preferences → Settings (Command + , )
- Format On Save 설정 체크박스를 체크해주면 된다.

# 6. 정리

- JSX는 HTML과 비슷하지만 완전히 똑같지는 않다. 코드로 보면 XML 형식이지만, 실제로는 자바스크립트 객체이며, 용도도 다르고 문법도 조금씩 차이가 난다.
