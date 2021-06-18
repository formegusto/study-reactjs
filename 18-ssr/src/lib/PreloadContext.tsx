import { createContext, useContext } from "react";

type ContextType = {
  done: boolean;
  promises: Promise<any>[];
};

const PreloadContext = createContext<ContextType>({
  done: false,
  promises: [],
});

export default PreloadContext;

type Params = {
  resolve: any;
};
export const Preloader = ({ resolve }: Params) => {
  const preloadContext = useContext(PreloadContext);
  if (preloadContext.done) return null;

  // promises 배열에 프로미스 등록
  // 설령 resolve 함수가 프로미스를 반환하지 않더라도, 프로미스 취급을 하기 위해
  // Promise.resolve 함수 사용
  preloadContext.promises.push(Promise.resolve(resolve()));
  return null;
};
