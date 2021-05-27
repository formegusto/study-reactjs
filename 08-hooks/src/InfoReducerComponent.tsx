import React, { useReducer } from "react";

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
  const [state, dispatch]: [
    State,
    (e: React.ChangeEvent<HTMLInputElement>) => void
  ] = useReducer(reducer, { name: "", nickname: "" });

  return (
    <div>
      <div>
        <input name="name" type="text" value={state.name} onChange={dispatch} />
        <input
          name="nickname"
          type="text"
          value={state.nickname}
          onChange={dispatch}
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
