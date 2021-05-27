import React, { useEffect, useState } from "react";

function InfoComponent() {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  // only mount execute
  useEffect(() => {
    console.log("마운트될 때만 실행된다.");
  }, []);

  // only change name execute
  useEffect(() => {
    console.log("name 이 변화할 때 실행된다. ===> ", name);
  }, [name]);

  // clean up
  useEffect(() => {
    console.log("effect");
    console.log(name);
    return () => {
      console.log("clean up");
      console.log(name);
    };
  });

  // basic
  useEffect(() => {
    console.log("렌더링 Okay");
    console.log("name: ", name);
    console.log("nickname: ", nickname);
  });

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  return (
    <div>
      <div>
        <input type="text" value={name} onChange={onChangeName} />
        <input type="text" value={nickname} onChange={onChangeNickname} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
}

export default InfoComponent;
