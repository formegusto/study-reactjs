import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import LifeCycleComponent from "./LifeCycleComponent";

function getRandomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

class App extends React.Component {
  state = {
    color: "#000000",
    rest: {},
  };

  handleClick = () => {
    this.setState({
      color: getRandomColor(),
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleClick}>랜덤 색상</button>
        <ErrorBoundary>
          <LifeCycleComponent {...this.state} />
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
