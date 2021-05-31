# styled-components

- 컴포넌트 스타일링의 또 다른 패러다임은 자바스크립트 파일 안에 스타일을 선언하는 방식이다.
- 이 방식을 'CSS-in-JS'라고 부른다.

[MicheleBertoli/css-in-js](https://github.com/MicheleBertoli/css-in-js)

- CSS-in-JS 라이브러리 중에서 개발자들이 가장 선호하는 라이브러리는 styled-components 이다.

```tsx
const Box = styled.div<StyledProps>`
  background: ${(props) => props.color || "blur"};
  padding: 1rem;
  display: flex;
`;

const Button = styled.button<StyledProps>`
  background: white;
  color: black;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  ${(props) =>
    props.inverted &&
    css`
      background: none;
      border: 2px solid white;
      color: white;

      &:hover {
        background: white;
        color: black;
      }
    `};
  & + button {
    margin-left: 1rem;
  }
`;
```

- 가장 큰 장점은 props 값으로 전달해주는 값을 쉽게 스타일에 적용할 수 있다는 점이다.

## 1. Tagged 템플릿 리터럴

- 스타일을 작성할 때 `(백틱)을 사용하여 만든 문자열에 스타일 정보를 넣어 주었다. 이를 Tagged 템플릿 리터럴이라고 부른다.
- CSS Module에서 언급된 일반 템플릿 리터럴과 다른 점은 템플릿 안에 자바스크립트 객체나 함수를 전달할 때, 온전히 추출할 수 있다는 것이다.

```tsx
`hello ${{ foo: "bar" }} ${() => "world"}`;
```

- 템플릿에 객체를 넣거나 함수를 넣으면 형태를 잃어버리게 된다. 이들이 문자열화되어 나타나게 된다.

```tsx
function tagged(...args) {
  console.log(args);
}
tagged`hello ${{ foo: "bar" }} ${() => "world"}`;
```

- 위와 같이 사용해주면 템플릿에 넣은 값을 온전히 추출할 수 있다.

![image](https://user-images.githubusercontent.com/52296323/120125951-9c65d600-c1f5-11eb-829a-fbc34a266b57.png)

- Tagged 템플릿 리터럴을 사용하면 이렇게 템플릿 사이사이에 들어가는 자바스크립트 객체나 함수의 원본 값을 그대로 추출할 수 있다. styled-components는 이러한 속성을 사용하여 styled-components로 만든 컴포넌트의 props를 스타일 쪽에서 쉽게 조회할 수 있도록 해준다.

## 2. 스타일링된 엘리먼트 만들기

- styled-components 에서는 styled.태그명을 사용하여 엘리먼트를 구현한다.
- 해당 엘리먼트에 Tagged 템플릿 리터럴 문법을 통해 스타일을 넣어 주면, 해당 스타일이 적용된 div로 이루어진 리액트 컴포넌트가 생성된다.
- 하지만 사용해야 할 태그명이 유동적이거나 특정 컴포넌트 자체에 스타일링해 주고 싶다면 다음과 같은 형태로 구현한다.

```tsx
const MyInput = styled("input")`
  background: gray;
`;

const StyledLink = styled(Link)`
  color: blue;
`;
```

- 이런식으로 컴포넌트를 styled의 파라미터에 넣는 경우에는 해당 컴포넌트에 className props를 최상위 DOM의 className 값으로 설정하는 작업이 내부적으로 되어 있어야 한다.

```tsx
const Sample = ({ className }) => {
  return <div className={className}>Sample</div>;
};

const StyledSample = styled(Sample)``;
```

## 3. 스타일에서 props 조회하기

- styled-components를 사용하면 스타일 쪽에서 컴포넌트에게 전달된 props 값을 참조할 수 있다.

## 4. props에 따른 조건부 스타일링

- styled-components에서는 조건부 스타일링을 간단하게 props로도 처리할 수 있다.

## 5. 반응형 디자인

- 일반 CSS를 사용할 때와 똑같이 media 쿼리(query)를 사용하면 된다.

```tsx
const Box = styled.div<StyledProps>`
  background: ${(props) => props.color || "blur"};
  padding: 1rem;
  display: flex;

  width: 1024px;
  margin: 0 auto;
  **@media (max-width: 1024px) {
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }**
`;
```

- 일반 CSS에서 할 때랑 큰 차이는 없지만, 이러한 작업을 여러 컴포넌트에서 반복해야 한다면 조금 귀찮을 수도 있다. 그럴 때는 이 작업을 함수화 하여 간편하게 사용할 수 있다.

```tsx
import { css, FlattenSimpleInterpolation } from "styled-components";

type SizesType = {
  [key: string]: number;
};

const sizes: SizesType = {
  desktop: 1024,
  tablet: 768,
};

type MediaType = {
  [key: string]: (
    ...args: TemplateStringsArray[]
  ) => FlattenSimpleInterpolation;
  desktop: (...args: TemplateStringsArray[]) => FlattenSimpleInterpolation;
  tablet: (...args: TemplateStringsArray[]) => FlattenSimpleInterpolation;
};

const media = Object.keys(sizes).reduce((acc, label) => {
  // 타입스크립트에서는 args가 이미 rest 인것을 타입에서 명시했기 때문에
  // 다시 args를 rest 문법으로 넣어줄 필요가 없다.
  acc[label] = (args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(args)};
    }
  `;

  return acc;
}, {} as MediaType);

export default media;
```

```tsx
const Box = styled.div<StyledProps>`
  background: ${(props) => props.color || "blur"};
  padding: 1rem;
  display: flex;

  width: 1024px;
  margin: 0 auto;

  **${media.desktop`width: 768px; height: 50px;`};
  ${media.tablet`width: 100%;`};**
`;
```
