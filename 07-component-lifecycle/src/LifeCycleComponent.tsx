import React from "react";

type State = {
  number: number;
  color: string | null;
};

class LifeCycleComponent extends React.Component<any, State> {
  state = {
    number: 0,
    color: null,
  };

  myRef: React.RefObject<HTMLHeadingElement> = React.createRef();

  render() {
    return (
      <div>
        <h1 ref={this.myRef}>{this.state.number}</h1>
        <p>color: {this.state.color}</p>
        <button>더하기</button>
      </div>
    );
  }
}

export default LifeCycleComponent;
