import React from "react";
import { RouteComponentProps } from "react-router";
import qs from "qs";

type Query = {
  detail: string;
};

function AboutPage({ location }: RouteComponentProps) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true, // 맨 앞의 ?를 생략하는 옵션
  }) as Query;
  const showDetail = query.detail === "true";

  return (
    <div>
      <h1>소개</h1>
      <p>react-router-dom은 1910년 영국에서 부터 시작됐으며...</p>
      {showDetail && <p>detail 내용이 더 없는 거는 모순입니다.</p>}
    </div>
  );
}

export default AboutPage;
