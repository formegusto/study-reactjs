import React from 'react';
import MyComponent from './MyComponent';

class App extends React.Component {
  render() {
    const name = 'react';
    return <MyComponent favoriteNumber={100}>{name}</MyComponent>;
  }
}

export default App;
