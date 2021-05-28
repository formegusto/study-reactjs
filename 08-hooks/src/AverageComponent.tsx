import React, { useCallback, useMemo, useRef, useState } from "react";

const getAverage = (nums: number[]): number => {
  console.log("평균값 계산 중..");
  return nums.reduce((cur, num) => cur + num / nums.length, 0);
};

function AverageComponent() {
  const [nums, setNums] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");
  const inputEl: React.Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []); // 컴포넌트가 처음 렌더링될 때만 함수 생성

  const onClick = useCallback(() => {
    setNums(nums.concat(parseInt(input)));
    setInput("");
    if (inputEl.current) inputEl.current.focus();
  }, [nums, input]); // number 혹은 list가 바뀌었을 때만 함수 생성

  const avg = useMemo(() => getAverage(nums), [nums]);

  return (
    <div>
      <input value={input} type="text" onChange={onChange} ref={inputEl} />
      <button onClick={onClick}>추가</button>
      <ul>
        {nums.map((num, idx) => (
          <li key={idx}>{num}</li>
        ))}
      </ul>
      <h1>평균값: {avg}</h1>
    </div>
  );
}

export default AverageComponent;
