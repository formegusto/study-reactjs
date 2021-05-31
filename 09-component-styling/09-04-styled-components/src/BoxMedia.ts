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
