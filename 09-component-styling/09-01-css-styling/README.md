# CSS-Styling

- 실제로 소규모 프로젝트를 개발하고 있다면 새로운 스타일링 시스템을 적용하는 것이 부담스러울 수도 있다. 그런 상황에는 프로젝트에 이미 적용되어 있는 기본 CSS 시스템을 사용하는 것만으로도 충분하다.
- 프로젝트 생성 시, App.tsx에 App.css 가 적용되어 있는 것을 확인 할 수 있다.

```tsx
import React from 'react';
import logo from './logo.svg';
**import './App.css';**

function App() {
  // (...)
}

export default App;
```

- CSS를 작성할 때 가장 중요한 점은 CSS 클래스를 중복되지 않게 만드는 것이다.

  → 이름에 특별한 규칙을 사용하여 짓거나, CSS Selector를 활용한다.

## 1. 이름짓는 규칙

- App.css를 읽어보면 클래스 네이밍을 [컴포넌트 이름-클래스] 형태로 지어져 있는 것을 볼 수 있다. 클래스 이름에 컴포넌트 이름을 포함시킴으로써, 다른 컴포넌트에서 실수로 중복되는 클래스를 만들어 사용하는 것을 방지할 수 있다.
- 비슷한 방식으로 BEM 네이밍(BEM Naming)이라는 방식도 있다.

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

## 2. CSS Selector

- CSS Selector를 사용하면 CSS 클래스가 특정 클래스 내부에 있는 경우에만 스타일을 적용할 수 있다.

```css
.App .logo {
  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
}

.App header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App a {
  color: #61dafb;
}
```
