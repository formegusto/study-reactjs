import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

function WithRouterPage(props: RouteComponentProps) {
  return (
    <div>
      <h4>location</h4>
      <textarea
        value={JSON.stringify(props.location, null, 2)}
        rows={7}
        readOnly={true}
      />
      <h4>match</h4>
      <textarea
        value={JSON.stringify(props.match, null, 2)}
        rows={7}
        readOnly={true}
      />
      <button onClick={() => props.history.push("/")}>홈으로</button>
    </div>
  );
}

export default withRouter(WithRouterPage);
