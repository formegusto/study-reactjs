import React from "react";
import "./styles/ValidationSample.css";

class ValidationComponent extends React.Component {
  input: React.RefObject<HTMLInputElement> | null = React.createRef();

  state = {
    password: "",
    clicked: false,
    validated: false,
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleButtonClick = () => {
    this.setState({
      clicked: true,
      validated: this.state.password === "0000",
    });

    this.input?.current?.focus();
  };

  render() {
    return (
      <div>
        <input
          ref={this.input}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          className={
            this.state.clicked
              ? this.state.validated
                ? "success"
                : "failure"
              : ""
          }
        />
        <button onClick={this.handleButtonClick}>validate</button>
      </div>
    );
  }
}

export default ValidationComponent;
