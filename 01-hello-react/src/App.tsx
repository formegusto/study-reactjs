import React from 'react';

function App() {
  const name = undefined;
  // return name || <>값이 undefined 입니다.</>;
  return <div>{name || '리액트'}</div>
}

export default App;
