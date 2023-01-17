import { FlatList } from "react-native";
import Message from "./message";

interface Props {
  chat: any
}

const Messages = ({chat}: Props) => {
  return (
    <FlatList
      data={chat.messages}
      renderItem={({ item }) => <Message message={item} />}
      inverted
    />
  );
}

export default Messages;