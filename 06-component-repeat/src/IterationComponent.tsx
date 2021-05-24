import React, { useState } from "react";

type IterType = {
  id: number;
  text: string;
};

const IterationComponent: React.FC = () => {
  const [names, setNames] = useState<IterType[]>([
    {
      id: 1,
      text: "눈사람",
    },
    {
      id: 2,
      text: "얼음",
    },
    {
      id: 3,
      text: "눈",
    },
    {
      id: 4,
      text: "바람",
    },
  ]);
  const [text, setText] = useState<string>("");
  const [nextId, setNextId] = useState<number>(5);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const onClick = () => {
    setNames(
      names.concat({
        id: nextId,
        text: text,
      })
    );
    setNextId(nextId + 1);
    setText("");
  };

  const onRemove = (id: number) => {
    setNames(names.filter((name) => name.id !== id));
  };

  const nameList: JSX.Element[] = names.map((name) => (
    <li key={name.id} onClick={(e) => onRemove(name.id)}>
      {name.text}
    </li>
  ));

  return (
    <>
      <input value={text} onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>{nameList}</ul>
    </>
  );
};

export default IterationComponent;
