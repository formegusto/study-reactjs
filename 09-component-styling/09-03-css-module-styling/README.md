# CSS Module

- CSS Module은 CSS를 불러와서 사용할 때 클래스 이름을 고유한 값, 즉 **[파일이름]_[클래스이름]_[해시값]** 형태로 자동으로 만들어서 컴포넌트 스타일 클래스 이름이 중첩되는 현상을 방지해주는 기술이다.
- .module.css 확장자로 파일을 저장하기만 하면 된다.

```css
/*
    자동으로 고유해질 것이므로,
    흔히 사용되는 단어를 클래스 이름으로 마음대로
    사용 가능하다.
*/

.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

/* Global CSS */
:global .something {
  font-weight: 800;
  color: aqua;
}
```

```tsx
import React from "react";
**import styles from "./CSSModule.module.css";**

function CSSModuleComponent() {
	console.log(styles);
	/*
	{
		wrapper: "CSSModule_**wrapper**__1F2tc"
	}
	지정한 클래스 이름 앞뒤로 파일 이름과 해시값이 붙었다.
	*/
  return (
    **<div className={styles.wrapper}>**
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
}

export default CSSModuleComponent;
```

- 클래스 네임 복수개 정의하기

```tsx
import React from "react";
import styles from "./CSSModule.module.css";

function CSSModuleComponent() {
  console.log(styles);
	/*
	{
		wrapper: "CSSModule_wrapper__1F2tc",
		inverted: "CSSModule_inverted__1duQB"
	}
	*/
  return (
    **<div className={`${styles.wrapper} ${styles.inverted}`}>**
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
}

export default CSSModuleComponent;
```

or

```tsx
<div className={[styles.wrapper, styles.inverted].join(" ")}>
  안녕하세요, 저는 <span className="something">CSS Module!</span>
</div>
```

## 1. classnames

- classnames는 CSS 클래스를 조건부로 설정할 때, 매우 유용한 라이브러리이다.
- CSS Module을 사용할 때, 이 라이브러리를 사용하면 여러 클래스를 적용할 때 매우 편리하다.
- usage

  ```tsx
  import classNames from 'classnames';

  classNames('one','two'); // = 'one two'
  classNames('one', { two: true }); // = 'one two'
  classNames('one', { two: false}); // = 'one'
  classNames('one', { 'two', 'three' }); // = 'one two three'

  const myClass = 'hello';
  classNames('one', myClass, { myCondition: true });
  																		// = 'one hello myCondition'
  ```

- 해당 라이브러리를 이용하면 props 값에 따라 다른 스타일을 주기가 쉬워진다.

  ```tsx
  const MyComponent: React.FC = ({ highlighted, theme }: Props) => (
    <div className={classNames("MyComponent", { highlighted }, theme)}>
      Hello
    </div>
  );
  ```

  이렇게 설정할 경우, 위 엘리먼트 클래스에 highlighted 값이 true이면 highlighted 클래스가 적용되고, false면 적용되지 않는다.

  또한 theme으로 전달받는 문자열은 내용 그대로 클래스에 적용된다.

- classnames는 CSS Module과 궁합이 아주 찰떡이다. classnames에 내장되어 있는 binde 함수를 사용하면, 클래스를 넣어 줄 때마다 styles.[클래스 이름] 형태를 사용할 필요가 없다.

  ```tsx
  import React from "react";
  **import classNames from "classnames/bind";**
  import styles from "./CSSModule.module.css";

  **const cx = classNames.bind(styles);**

  function CSSModuleComponent() {
    return (
      **<div className={cx("wrapper", "inverted")}>**
  	    안녕하세요, 저는 <span className="something">CSS Module!</span>
  	  </div>
    );
  }

  export default CSSModuleComponent;
  ```

  사전에 미리 styles에서 받아 온 후 사용하게끔 설정해 두고 cx('클래스 이름', '클래스 이름2') 형태로 사용할 수 있다.

## 2. Sass와 함께 사용하기

- Sass를 사용할 때도 파일 이름 뒤에 .module.scss 확장자를 사용해 주면 CSS Module로 사용할 수 있다.
- 문법만 sass 문법으로 바꿔주면 된다.

```scss
/*
    자동으로 고유해질 것이므로,
    흔히 사용되는 단어를 클래스 이름으로 마음대로
    사용 가능하다.
*/

.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
  &.inverted {
    color: black;
    background: white;
    border: 1px solid black;
  }
}

/* Global CSS */
:global {
  .something {
    font-weight: 800;
    color: aqua;
  }
}
```

## 3. CSS Module이 아닌 파일에서 CSS Module 사용하기

- CSS Module에서 글로벌 클래스를 정의할 때 :global 을 사용했던 것처럼 CSS Module이 아닌, 일반 .css/.scss 파일에서도 :local을 사용하여 CSS Module을 사용할 수 있다.
