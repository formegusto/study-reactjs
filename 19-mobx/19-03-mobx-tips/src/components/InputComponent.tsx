import React from "react";
import { InputObject } from "../store/input";

type Props = {
  name: string;
  // input: InputObject;
  changeInput: (e: React.ChangeEvent) => void;
};

function InputComponent({ name, changeInput }: Props) {
  console.log("is name", name);
  // console.log(input);
  return (
    <>
      <input type="text" name="name" value={name} onChange={changeInput} />
      {/* {Object.keys(input).map((name, idx) => (
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
      ))} */}
    </>
  );
}

export default InputComponent;
