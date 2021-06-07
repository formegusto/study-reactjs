import React from 'react';

type Props = {};

function TodoItem(props: Props) {
  return (
    <div>
      <input type="checkbox" />
      <span>예제 텍스트</span>
      <button>텍스트</button>
    </div>
  );
}

export default TodoItem;
