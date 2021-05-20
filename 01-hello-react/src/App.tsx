import React from 'react';

function App() {
  let name = '리액트';
  return (
    <>
      {name === '리액트' && (
        <h1>리액트입니다.</h1>
      )} 
      <h2>잘 작동하니?</h2> 
    </>
  );
}

export default App;
