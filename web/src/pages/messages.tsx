import { Box, ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ChatBox from "../components/Messaging/ChatBox";
import MyChats from "../components/Messaging/MyChats";
import { GetChats, GetCurrentUserInfo, GetUserInfo } from "../request/fetch";
import { user } from "../types/auth.types";
import { chat } from "../types/chat.types";

export default function Messages() {
  const router = useRouter();
  const { chatId } = router.query;
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

  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const [userId, setUserId] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState<user>({} as user);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (myChats && chatId) {
      const foundChat = myChats.find((ch: chat) => ch.id === chatId);
      if (foundChat) {
        setSelectedChat(foundChat);
        const otherUserId = foundChat.users.find((id: string) => id !== userId);
        if (otherUserId) {
          // Fetch the other user object using the otherUserId
          GetUserInfo(otherUserId)
            .then((otherUser) => {
              setSelectedChatUser(otherUser);
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }, [myChats, chatId, userId]);

  return (
    <ChakraProvider>
      <Box
        as="div"
        className="relative mx-auto h-full min-h-screen max-w-7xl bg-white"
      >
        <Flex width="100%" height="91.5vh" padding="10px">
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
        </Flex>
      </Box>
    </ChakraProvider>
  );
}
