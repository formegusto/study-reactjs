import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import ProfilePage from "./ProfilePage";

function ProfilesPage() {
  return (
    <div>
      <h3>사용자 목록</h3>
      <ul>
        <li>
          <Link to="/profiles/iamformegusto">formegusto profile</Link>
        </li>
        <li>
          <Link to="/profiles/mike">mike profile</Link>
        </li>
      </ul>
      <div>
        <Route
          path="/profiles"
          component={() => <div>사용자를 선택해주세요.</div>}
          exact
        />
        <Route path="/profiles/:username" component={ProfilePage} />
      </div>
    </div>
  );
}

export default ProfilesPage;
