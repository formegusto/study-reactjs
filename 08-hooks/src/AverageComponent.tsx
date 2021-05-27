import React, { useMemo, useState } from "react";

const getAverage = (nums: number[]): number => {
  console.log("평균값 계산 중..");
  return nums.reduce((cur, num) => cur + num / nums.length, 0);
};

function AverageComponent() {
  const [nums, setNums] = useState<number[]>([]);
  const [input, setInput] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onClick = () => {
    setNums(nums.concat(parseInt(input)));
    setInput("");
  };

  const avg = useMemo(() => getAverage(nums), [nums]);

  return (
    <div>
      <input value={input} type="text" onChange={onChange} />
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
