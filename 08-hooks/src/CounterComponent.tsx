import React, { useState } from "react";

function CounterComponent() {
  const [value, setValue] = useState<number>(0);

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{value}</b>입니다.
      </p>
      <button onClick={() => setValue(value + 1)}>+</button>
      <button onClick={() => setValue(value - 1)}>-</button>
    </div>
  );
}

export default CounterComponent;
