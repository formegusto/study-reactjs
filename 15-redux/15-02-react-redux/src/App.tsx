import React from 'react';
import TodosComponent from './components/TodosComponent';
import CounterContainer from './containers/CounterContainer';

function App() {
  return (
    <>
      <CounterContainer />
      <hr />
      <TodosComponent />
    </>
  );
}

export default App;
