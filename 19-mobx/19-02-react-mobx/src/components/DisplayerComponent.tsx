import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  getName: () => string;
  changeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function DisplayerComponent({ getName, changeName }: Props) {
  return (
    <>
      <h1>name: {getName()}</h1>
      <input onChange={changeName} />
    </>
  );
}

export default observer(DisplayerComponent);
