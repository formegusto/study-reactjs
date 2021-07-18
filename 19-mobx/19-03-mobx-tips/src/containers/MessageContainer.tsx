import { observer } from "mobx-react";
import MessageComponent from "../components/MessageComponent";
import Message from "../store/message";

type Props = {
  store: Message;
};

function MessageContainer({ store }: Props) {
  return (
    <MessageComponent
      title={store.title}
      authorName={store.author.name}
      changeAuthor={store.changeAuthor}
      //   changeAuthorName={store.changeAuthorName}
    />
  );
}

export default observer(MessageContainer);
