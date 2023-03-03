import { Box, ChakraProvider, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

import ChatBox from "../components/Messaging/ChatBox";
import MyChats from "../components/Messaging/MyChats";
import { GetChats, GetCurrentUserInfo } from "../request/fetch";
import { user } from "../types/auth.types";
import { chat } from "../types/chat.types";
export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const [userId, setUserId] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState<user>({} as user);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { data: userData, isLoading: userLoading } = useQuery(["UserInfo"], {
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {
      setUserId(data.id);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data: myChats, isLoading: chatsLoading } = useQuery(["chats"], {
    queryFn: () => GetChats(),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <ChakraProvider>
      <div className="relative mx-auto h-full min-h-screen max-w-7xl bg-white">
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
              chats={myChats as chat[]}
              userId={userId}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setSelectedChatUser={setSelectedChatUser}
              selectedChatUser={selectedChatUser}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          )}

          <ChatBox
            selectedChat={selectedChat}
            userId={userId}
            selectedChatUser={selectedChatUser}
            setSelectedChat={setSelectedChat}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        </Box>
      </div>
    </ChakraProvider>
  );
}
