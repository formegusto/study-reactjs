# Sass-Styling

- Sass(Syntactically Awesome Style Sheets:문법적으로 매우 멋진 스타일시트)는 CSS 전처리기로 복잡한 작업을 쉽게 할 수 있도록 해 주고, 스타일 코드의 재활용성을 높여 줄 뿐만 아니라, 코드의 가독성을 높여서 유지 보수를 더욱 쉽게 해준다.
- sass에서는 두 가지 확장자 .scss와 .sass를 지원한다. 둘의 문법은 제법 차이가 있다.

```sass
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
	font: 100% $font-stack
	color: $primary-color
```

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

- 설치 : yarn add node-sass
  - 최근 6버전은 오류가 난다.
  - yarn add node-sass@4.14.1 을 통해 구버전을 설치하자.

```scss
// 변수 사용하기
$red: #fa5252;
$orange: #fd7e14;
$yellow: #fcc419;
$green: #40c057;
$blue: #339af0;
$indigo: #5c7cfa;
$violet: #7950f2;

// 믹스인 만들기(재사용되는 스타일 블록을 함수처럼 사용할 수 있음)
@mixin square($size) {
  $calculated: 32px * $size;
  width: $calculated;
  height: $calculated;
}

.SassComponent {
  display: flex;
  .box {
    background: $red;
    cursor: pointer;
    transition: all 0.3s ease-in;

    &.red {
      // .red 클래스가 .box와 함께 사용되었을 때
      background: $red;
      @include square(1);
    }

    &.oragne {
      background: $orange;
      @include square(2);
    }

    &.yellow {
      background: $yellow;
      @include square(3);
    }

    &.green {
      background: $green;
      @include square(4);
    }

    &.blue {
      background: $blue;
      @include square(5);
    }

    &.indigo {
      background: $indigo;
      @include square(6);
    }

    &.violet {
      background: $violet;
      @include square(7);
    }

    &:hover {
      background: black;
    }
  }
}
```

```tsx
import React from "react";
import "./SassComponent.scss";

function SassComponent() {
  return (
    <div className="SassComponent">
      <div className="box red" />
      <div className="box orange" />
      <div className="box yellow" />
      <div className="box green" />
      <div className="box blue" />
      <div className="box indigo" />
      <div className="box violet" />
    </div>
  );
}

export default SassComponent;
```

## 1. utils 함수 분리하기

- 여러 파일에서 사용될 수 있는 Sass 변수 및 믹스인은 다른 파일로 따로 분리하여 작성한 뒤 필요한 곳에서 쉽게 불러와 사용할 수 있다.
- ./styles/utils.scss

  ```scss
  // 변수 사용하기
  $red: #fa5252;
  $orange: #fd7e14;
  $yellow: #fcc419;
  $green: #40c057;
  $blue: #339af0;
  $indigo: #5c7cfa;
  $violet: #7950f2;

  // 믹스인 만들기(재사용되는 스타일 블록을 함수처럼 사용할 수 있음)
  @mixin square($size) {
    $calculated: 32px * $size;
    width: $calculated;
    height: $calculated;
  }
  ```

- SassComponent.scss

  ```scss
  **@import "./styles/utils.scss";**

  .SassComponent {
    display: flex;
    .box {
      background: $red;
      cursor: pointer;
      transition: all 0.3s ease-in;

  		// (...)
    }
  }
  ```

## 2. sass-loader 설정 커스터마이징하기

- yarn eject
- config/webpack.config.js

  ```jsx
  test: sassRegex,
  exclude: sassModuleRegex,
  use: getStyleLoaders({
    importLoaders: 2,
    sourceMap: isEnvProduction && shouldUseSourceMap,
  **}).concat({
    loader: require.resolve("sass-loader"),
    options: {
      sassOptions: {
        sourceMap: isEnvProduction && shouldUseSourceMap,
        includePaths: [paths.appSrc + "/styles"],
      },
    },
  }),**
  ```

- SassComponent.scss

  ```scss
  **@import "utils.scss";**

  // (...)
  ```

- sass-loader의 additionalData 옵션을 설정해주면 매번 모든 파일에 @import "utils.scss" 키워드를 포함시키지 않아도 된다.

  ```scss
  {
    test: sassRegex,
    exclude: sassModuleRegex,
    **use: getStyleLoaders({
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    }).concat({
      loader: require.resolve("sass-loader"),
      options: {
        additionalData: "@import 'utils';",
        sassOptions: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
          includePaths: [paths.appSrc + "/styles"],
        },
      },
    }),**
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  ```

## 3. node_modules에서 라이브러리

- Sass의 장점 중 하나는 라이브러리를 쉽게 불러와서 사용할 수 있다는 점 이다.
- 일반적인 설치 라이브러리 사용하는 방법

  ```scss
  @import "../../../node_modules/library/styles";
  ```

- 물결 문자(~) 이용 방법

  ```scss
  @import "~library/styles";
  ```

- yarn add open-color include-media

  - include-media : 반응형 디자인을 쉽게 만들어주는 라이브러리.
  - open-color : 편리한 색상 팔레트

  ```scss
  // utils.scss
  @import "~include-media/dist/include-media";
  @import "~open-color/open-color";

  // (...)
  ```

  ```scss
  // SassComponent.scss
  .SassComponent {
    display: flex;
    background: $oc-gray-2;
    @include media("<768px") {
      background: $oc-gray-9;
    }
    // (...)
  }
  ```
