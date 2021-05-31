import React from 'react';
import '../styles/TodoTemplate.scss';

type Props = {};

function TodoTemplate(props: React.PropsWithChildren<Props>) {
  return (
    <div className="TodoTemplate">
      <div className="app-title">일정 관리</div>
      <div className="content">{props.children}</div>
    </div>
  );
}

export default TodoTemplate;
