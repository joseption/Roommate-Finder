import { Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { GetChats, GetCurrentUserInfo } from "../request/fetch";
import { chat } from "../types/chat.types";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<chat>();
  const [chats, setChats] = useState<chat[]>();

  const { data: userData, isLoading: userLoading } = useQuery(["UserInfo"], {
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {
      console.log(data, "user query");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data: myChats, isLoading: chatsLoading } = useQuery(["chats"], {
    queryFn: () => GetChats(userData?.id as string),
    onSuccess: (data) => {
      setChats(chats);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return <Box></Box>;
}
