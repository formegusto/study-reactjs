import React, { CSSProperties } from "react";
import { Route } from "react-router";
import { NavLink } from "react-router-dom";
import ProfilePage from "./ProfilePage";

function ProfilesPage() {
  const activeStyle: CSSProperties = {
    backgroundColor: "#000",
    color: "#FFF",
  };

  return (
    <div>
      <h3>사용자 목록</h3>
      <ul>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/iamformegusto">
            formegusto profile
          </NavLink>
        </li>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/mike">
            mike profile
          </NavLink>
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
