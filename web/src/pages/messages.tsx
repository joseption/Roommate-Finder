import { Box, ChakraProvider, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ChatBox from "../components/Messaging/ChatBox";
import MyChats from "../components/Messaging/MyChats";
import { GetChats, GetCurrentUserInfo } from "../request/fetch";
import { user } from "../types/auth.types";
import { chat } from "../types/chat.types";
export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<chat | null>();
  const [chats, setChats] = useState<chat[]>([]);
  const [userId, setUserId] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState<user>();
  const { data: userData, isLoading: userLoading } = useQuery(["UserInfo"], {
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {
      setUserId(data.id);
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      // console.log(userId, "user loaded");
    },
  });
  const { data: myChats, isLoading: chatsLoading } = useQuery(["chats"], {
    queryFn: () => GetChats(userData?.id as string),
    onSuccess: (data) => {
      setChats(data);
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      // console.log(chats, "chats loaded");
    },
  });

  return (
    <ChakraProvider>
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {chatsLoading ? (
            <Spinner />
          ) : (
            <MyChats
              chats={chats}
              userId={userId}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setSelectedChatUser={setSelectedChatUser}
              selectedChatUser={selectedChatUser}
            />
          )}
          {chatsLoading ? (
            <Spinner />
          ) : (
            <ChatBox
              selectedChat={selectedChat}
              user={userData}
              selectedChatUser={selectedChatUser}
              setSelectedChat={setSelectedChat}
            />
          )}
        </Box>
      </div>
    </ChakraProvider>
  );
}
