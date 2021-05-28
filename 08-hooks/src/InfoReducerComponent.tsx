import React, { useReducer } from "react";
import useInputs from "./useInputs";

type State = {
  name: string;
  nickname: string;
};

function reducer(state: State, e: React.ChangeEvent<HTMLInputElement>) {
  return {
    ...state,
    [e.target.name]: e.target.value,
  };
}

function InfoReducerComponent() {
  const [state, onChange]: [
    State,
    (e: React.ChangeEvent<HTMLInputElement>) => void
  ] = useInputs<State>({
    name: "",
    nickname: "",
  });

  return (
    <div>
      <div>
        <input name="name" type="text" value={state.name} onChange={onChange} />
        <input
          name="nickname"
          type="text"
          value={state.nickname}
          onChange={onChange}
        />
      </div>
      <div>
        <div>
          <b>이름:</b> {state.name}
        </div>
        <div>
          <b>닉네임:</b> {state.nickname}
        </div>
      </div>
    </div>
  );
}

export default InfoReducerComponent;
