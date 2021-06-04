import React from "react";
import ColorContext from "../contexts/Color";

const colors: string[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];

class SelectComponent extends React.Component {
  static contextType = ColorContext;

  render() {
    const { actions } = this.context;

    return (
      <div>
        <h2>색상을 선택하세요</h2>
        <div style={{ display: "flex" }}>
          {colors.map((color, idx) => (
            <div
              key={idx}
              style={{
                background: color,
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
              onClick={() => actions.setColor(color)}
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault(); // 메뉴가 뜨는 것을 방지하기 위함.
                actions.setSubcolor(color);
              }}
            />
          ))}
        </div>
        <hr />
      </div>
    );
  }
}

export default SelectComponent;
