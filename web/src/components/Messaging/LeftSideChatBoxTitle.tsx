import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { GetUserInfo } from "../../request/fetch";
import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
interface Props {
  chat: chat;
  userId: string;
  setSelectedChatUser: (user: user) => void;
}

function LeftSideChatBoxTitle({ userId, chat, setSelectedChatUser }: Props) {
  const [senderName, setSenderName] = useState("");
  function getSenderId(userId: string, users: string[]) {
    return users[0] === userId ? users[1] : users[0];
  }
  const senderId = getSenderId(userId, chat.users);
  const { data: senderInfo, isLoading: senderLoading } = useQuery(
    ["SenderInfo", senderId],
    {
      queryFn: () => GetUserInfo(senderId as string),
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data) => {
        // setSenderName(data.email);
        // setSelectedChatUser(data);
      },
    }
  );
  setSenderName(senderInfo?.email as string);
  setSelectedChatUser(senderInfo as user);
  return <Text>{senderName}</Text>;
}

export default LeftSideChatBoxTitle;
