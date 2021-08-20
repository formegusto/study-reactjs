import React from "react";
import {
  MotionLayoutProvider,
  MotionScreen,
  useMotion,
  MotionScene,
  SharedElement,
} from "react-motion-layout";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { Stories, Story } from "./store/Stories";
import { BrowserRouter as Router } from "react-router-dom";

function StoryComponent() {
  const { storyId } = useParams<{ storyId: string }>();
  const { image, text } = Stories.filter(
    (story) => story.id === parseInt(storyId)
  )[0];

  return (
    <MotionScreen>
      <MotionScene name={`story-${storyId}`} scrollUpOnEnter>
        <SharedElement.Text animationKey="text-main">{text}</SharedElement.Text>
        <SharedElement.Image animationKey="big-image" src={image} />
      </MotionScene>
    </MotionScreen>
  );
}

function Item({ data }: { data: Story }) {
  const history = useHistory();
  const withTransition = useMotion(`story-${data.id}`);
  const callback = React.useCallback(
    () => history.push(`/story/${data.id}`),
    [data, history]
  );

  return (
    <MotionScene name={`story-${data.id}`} onClick={withTransition(callback)}>
      <SharedElement.Image animationKey="big-image" src={data.image} />
      <SharedElement.Text animationKey="text-main">
        {data.text}
      </SharedElement.Text>
    </MotionScene>
  );
}

function Feed() {
  return (
    <MotionScreen>
      {Stories.map((data, i) => (
        <Item data={data} key={i} />
      ))}
    </MotionScreen>
  );
}

function Basic() {
  return (
    <Router>
      <MotionLayoutProvider>
        <Switch>
          <Route path="/story/:storyId" component={StoryComponent} />
          <Route path="/" component={Feed} exact />
        </Switch>
      </MotionLayoutProvider>
    </Router>
  );
}

export default Basic;
