import React from "react";

class ScrollBox extends React.Component {
  box: React.RefObject<HTMLDivElement> = React.createRef();

  scrollToBottom = () => {
    if (this.box.current) {
      const { scrollHeight, clientHeight } = this.box.current;

      this.box.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  render() {
    const style: React.CSSProperties = {
      border: "1px solid black",
      height: "300px",
      width: "300px",
      overflow: "auto",
      position: "relative",
    };

    const innerStyle: React.CSSProperties = {
      width: "100%",
      height: "650px",
      background: "linear-gradient(white, black)",
    };

    return (
      <div style={style} ref={this.box}>
        <div style={innerStyle} />
      </div>
    );
  }
}

export default ScrollBox;
