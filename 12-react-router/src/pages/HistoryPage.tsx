import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

function HistoryPage({ history }: RouteComponentProps) {
  useEffect(() => {
    // 마운트때 history.block 을 설정해두면,
    const unblock = history.block("정말 떠나실 건가요?");
    return () => {
      // 페이지를 벗어나려고 할 때마다 질문을 한다.
      unblock();
    };
  });

  const handleGoBack = () => {
    history.goBack();
  };

  const handleGoHome = () => {
    history.push("/");
  };

  return (
    <div>
      <button onClick={handleGoBack}>뒤로</button>
      <button onClick={handleGoHome}>홈으로</button>
    </div>
  );
}

export default HistoryPage;
