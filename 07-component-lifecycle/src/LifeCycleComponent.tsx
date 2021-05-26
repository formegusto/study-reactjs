import React from "react";

type Props = {
  color: string;
};

type State = {
  number: number;
  color: string | null;
};

class LifeCycleComponent extends React.Component<Props, State> {
  state = {
    number: 0,
    color: null,
  };

  myRef: React.RefObject<HTMLHeadingElement> = React.createRef();

  constructor(props: Props) {
    super(props);

    console.log("constructor");
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    console.log("getDerivedStateFromProps", nextProps, prevState);
    if (nextProps.color !== prevState.color) {
      return { color: nextProps.color };
    }
    return null;
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    console.log("shouldComponentUpdate", nextProps, nextState);
    return nextState.number % 10 !== 4;
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    console.log("getSnapshotBeforeUpdate");
    if (prevProps.color !== this.props.color) {
      return this.myRef.current!.style.color;
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: State) {
    console.log("componentDidUpdate", prevProps, prevState);
    if (snapshot) {
      console.log("업데이트되기 직전 색상: ", snapshot);
    }
  }

  render() {
    const style: React.CSSProperties = {
      color: this.props.color,
    };

    return (
      <div>
        <h1 style={style} ref={this.myRef}>
          {this.state.number}
        </h1>
        <p>color: {this.state.color}</p>
        <button onClick={this.handleClick}>더하기</button>
      </div>
    );
  }
}

export default LifeCycleComponent;
