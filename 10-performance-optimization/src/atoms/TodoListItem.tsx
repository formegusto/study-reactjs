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
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  style: React.CSSProperties;
};

function TodoListItem(props: Props) {
  return (
    <div className="TodoListItem-virtualized" style={props.style}>
      <div className="TodoListItem">
        <div
          className={cn('checkbox', props.todo.checked && 'checked')}
          onClick={() => props.onToggle(props.todo.id)}
        >
          {props.todo.checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <div className="text">{props.todo.text}</div>
        </div>
        <div className="remove" onClick={() => props.onDelete(props.todo.id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    </div>
  );
}

export default React.memo(
  TodoListItem,
  (prevProps, nextProps) => prevProps.todo === nextProps.todo,
);
