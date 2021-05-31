import React, { useCallback, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import '../styles/TodoForm.scss';

type Props = {
  onInsert: (text: string) => void;
};

function TodoForm(props: Props) {
  const [value, setValue] = useState<string>('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      props.onInsert(value);
      setValue('');
    },
    [value, props],
  );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <form className="TodoInsert" onSubmit={onSubmit}>
      <input
        value={value}
        placeholder="할 일을 입력하세요"
        onChange={onChange}
      />
      <button type="submit">
        <MdAdd />
      </button>
    </form>
  );
}

export default TodoForm;
