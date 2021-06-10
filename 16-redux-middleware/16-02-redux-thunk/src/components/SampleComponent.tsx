import React from "react";

function SampleComponent() {
  return (
    <div>
      <section>
        <h1>포스트</h1>
        <div>
          <h3>제목</h3>
          <h3>내용</h3>
        </div>
      </section>
      <hr />
      <section>
        <h1>사용자 목록</h1>
        <ul>
          {[1, 2, 3, 4, 5].map((arr, idx) => (
            <li key={idx}>{idx}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SampleComponent;
