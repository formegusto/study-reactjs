import React from "react";
import classNames from "classnames/bind";
import styles from "./CSSModule.module.scss";

const cx = classNames.bind(styles);

function CSSModuleComponent() {
  console.log(cx("wrapper"));
  console.log(styles);
  return (
    <>
      <div className={cx("wrapper", "inverted")}>
        안녕하세요, 저는 <span className="something">CSS Module!</span>
      </div>
      <div className={[styles.wrapper, styles.inverted].join(" ")}>
        안녕하세요, 저는 <span className="something">CSS Module!</span>
      </div>
    </>
  );
}

export default CSSModuleComponent;
