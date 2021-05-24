import React from "react";

class EventComponent extends React.Component {
  state = {
    username: "",
    msg: "",
  };

  // 해당 클래스에 바인딩 해주는 작업이 필요하다.
  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleClick() {
    alert(this.state.username + ": " + this.state.msg);
    this.setState({
      username: "",
      msg: "",
    });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.handleClick();
    }
  }

  render() {
    return (
      <div>
        <h1>이벤트 연습</h1>
        <input
          type="text"
          name="username"
          placeholder="사용자명"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="msg"
          placeholder="아무거나 입력해 보세요"
          value={this.state.msg}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.handleClick}>확인</button>
      </div>
    );
  }
}

export default EventComponent;
