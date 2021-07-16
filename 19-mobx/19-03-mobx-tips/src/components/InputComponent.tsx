import React from "react";
import { InputObject } from "../store/input";

type Props = {
  input: InputObject;
  changeInput: (e: React.ChangeEvent) => void;
};

function InputComponent({ input, changeInput }: Props) {
  console.log(input);
  return (
    <>
      {Object.keys(input).map((name, idx) => (
        <>
          <input
            type="text"
            name={name}
            key={`${name} - ${idx}`}
            value={input[name]}
            onChange={changeInput}
          />
          <br />
        </>
      ))}
    </>
  );
}

export default InputComponent;
