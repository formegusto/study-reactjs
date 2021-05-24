import React from "react";

class RefComponent extends React.Component {
  input: React.RefObject<HTMLInputElement> = React.createRef();

  handleFocus = () => {
    this.input.current?.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.input} />
      </div>
    );
  }
}

export default RefComponent;
