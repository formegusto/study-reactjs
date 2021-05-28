import React, { useReducer } from "react";

function reducer<S>(state: S, e: React.ChangeEvent<any>): S {
  return {
    ...state,
    [e.target.name]: [e.target.value],
  };
}

export default function useInputs<S>(initState: S): [S, typeof onChange] {
  const [state, dispatch] = useReducer(reducer, initState);

  const onChange = (e: React.ChangeEvent<any>) => {
    dispatch(e);
  };

  return [state as S, onChange];
}
