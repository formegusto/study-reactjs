import React from 'react';
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
};

function TodoListItem(props: Props) {
  return (
    <div className="TodoListItem">
      <div className={cn('checkbox', props.todo.checked && 'checked')}>
        {props.todo.checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        <div className="text">{props.todo.text}</div>
      </div>
      <div className="remove">
        <MdRemoveCircleOutline />
      </div>
    </div>
  );
}

export default TodoListItem;
