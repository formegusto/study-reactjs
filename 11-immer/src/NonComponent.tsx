import React, { useCallback, useRef, useState } from "react";

type FormType = {
  name: string;
  username: string;
};

type Data = {
  id: number;
  name: string;
  username: string;
};
type DataObject = {
  array: Data[];
  uselessValue: null;
};

function NonComponent() {
  const nextId = useRef<number>(1);

  const [form, setForm] = useState<FormType>({ name: "", username: "" });
  const [data, setData] = useState<DataObject>({
    array: [],
    uselessValue: null,
  });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm({
        ...form,
        [name]: value,
      });
    },
    [form]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const info: Data = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      setData({
        ...data,
        array: data.array.concat(info),
      });

      setForm({
        name: "",
        username: "",
      });

      nextId.current += 1;
    },
    [form, data]
  );

  const onRemove = useCallback(
    (id: number) => {
      setData({
        ...data,
        array: data.array.filter((d) => d.id !== id),
      });
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NonComponent;
