import React from "react";
import {
  MotionLayoutProvider,
  MotionScreen,
  useMotion,
  MotionScene,
  SharedElement,
} from "react-motion-layout";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import PhotosDB, { Photo as PhotoType } from "./store/Photos";

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();
  const item = PhotosDB[parseInt(photoId) || 0];

  return (
    <MotionScreen>
      <MotionScene name={`photo-${photoId}`}>
        <div className="flex flex-col p-8">
          <SharedElement.Image
            style={{ width: "500px", height: "500px" }}
            className="w-64"
            alt=""
            src={item.photo}
            animationKey="image"
          />
        </div>
      </MotionScene>
    </MotionScreen>
  );
}

function ItemComponent({ item, id }: { item: PhotoType; id: number }) {
  const history = useHistory();
  const withTransition = useMotion(`photo-${id}`);
  const callback = React.useCallback(
    () => history.push(`/photo/${id}`),
    [history, id]
  );

  return (
    <MotionScene name={`photo-${id}`} onClick={withTransition(callback)}>
      <div className="lg:p-4 md:p-2 p-1 cursor-pointer hover:bg-gray-100">
        <SharedElement.Image
          className="w-64"
          alt=""
          src={item.photo}
          animationKey="image"
        />
      </div>
    </MotionScene>
  );
}

function Photos() {
  return (
    <MotionScreen>
      <div className="flex flex-wrap">
        <div className="flex w-1/3 flex-col">
          {PhotosDB.slice(0, 2).map((item, id) => (
            <ItemComponent item={item} id={id} key={id} />
          ))}
        </div>
        <div className="flex w-1/3 flex-col">
          {PhotosDB.slice(2, 4).map((item, id) => (
            <ItemComponent item={item} id={id + 2} key={id} />
          ))}
        </div>
        <div className="flex w-1/3 flex-col">
          {PhotosDB.slice(4, 6).map((item, id) => (
            <ItemComponent item={item} id={id + 4} key={id} />
          ))}
        </div>
      </div>
    </MotionScreen>
  );
}

function GalleryExample() {
  return (
    <Router>
      <MotionLayoutProvider>
        <Switch>
          <Route path="/photo/:photoId">
            <Photo />
          </Route>
          <Route path="/">
            <Photos />
          </Route>
        </Switch>
      </MotionLayoutProvider>
    </Router>
  );
}

export default GalleryExample;
