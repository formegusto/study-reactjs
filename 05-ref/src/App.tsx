import React from "react";
import ScrollBox from "./atoms/ScrollBox";

class App extends React.Component {
  scrollBox: React.RefObject<ScrollBox> = React.createRef();

  render() {
    return (
      <>
        <ScrollBox ref={this.scrollBox} />
        <button onClick={() => this.scrollBox.current!.scrollToBottom()}>
          맨 밑으로
        </button>
      </>
    );
  }
}

export default App;
