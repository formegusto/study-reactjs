import styled from "styled-components";
import TodosSecContainer from "../containers/TodosSecContainer";
import UsersSecContainer from "../containers/UsersSecContainer";

function InjectTestPage() {
  return (
    <PageWrap>
      <TodosSecContainer />
      <UsersSecContainer />
    </PageWrap>
  );
}

const PageWrap = styled.div`
  display: flex;

  width: 100vw;
  height: 100vh;

  & > div {
    flex: 1;

    height: 100vh;
    overflow-y: scroll;
  }

  & > .users {
    position: relative;
  }
`;

export default InjectTestPage;
