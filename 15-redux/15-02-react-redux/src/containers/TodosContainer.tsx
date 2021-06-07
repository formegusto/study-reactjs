import React from 'react';
import { ConnectedProps } from 'react-redux';
import TodosComponent from '../components/TodosComponent';
import TodosConnector from '../store/todos/connector';

type Props = ConnectedProps<typeof TodosConnector>;

function TodosContainer(props: Props) {
  return (
    <TodosComponent
      input={props.input}
      todos={props.todos}
      onChange={props.changeInput}
      onInsert={props.insert}
      onRemove={props.remove}
      onToggle={props.toggle}
    />
  );
}

export default TodosConnector(TodosContainer);
