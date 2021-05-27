import React from "react";

type State = {
  error: false;
};
class ErrorBoundary extends React.Component {
  state: State = {
    error: false,
  };

  componentDidCatch(error: any, info: any) {
    this.setState({
      error: true,
    });
    console.log(error, info);
  }

  render() {
    if (this.state.error) return <div>에러가 발생했습니다!</div>;
    return this.props.children;
  }
}

export default ErrorBoundary;
