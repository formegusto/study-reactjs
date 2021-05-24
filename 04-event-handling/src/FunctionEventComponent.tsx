import React, { useState } from "react";

type EventState = {
  username: string;
  msg: string;
};

const FunctionEventComponent: React.FC = (props: any) => {
  const [state, setState] = useState<EventState>({
    username: "",
    msg: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    alert(state.username + ": " + state.msg);
    setState({
      username: "",
      msg: "",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div>
      <h1>이벤트 연습</h1>
      <input
        type="text"
        name="username"
        placeholder="사용자명"
        value={state.username}
        onChange={handleChange}
      />
      <input
        type="text"
        name="msg"
        placeholder="아무거나 입력해 보세요"
        value={state.msg}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleClick}>확인</button>
    </div>
  );
};

export default FunctionEventComponent;
