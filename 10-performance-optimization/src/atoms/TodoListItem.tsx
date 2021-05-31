import React, { useCallback } from 'react';
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { Todo } from '../hooks/useTodos';
import '../styles/TodoListItem.scss';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TodoListItem(props: Props) {
  const onDelete = useCallback(() => {
    props.onDelete(props.todo.id);
  }, [props]);

  const onToggle = useCallback(() => {
    props.onToggle(props.todo.id);
  }, [props]);

  return (
    <div className="TodoListItem">
      <div
        className={cn('checkbox', props.todo.checked && 'checked')}
        onClick={onToggle}
      >
        {props.todo.checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        <div className="text">{props.todo.text}</div>
      </div>
      <div className="remove" onClick={onDelete}>
        <MdRemoveCircleOutline />
      </div>
    </div>
  );
}

export default TodoListItem;
