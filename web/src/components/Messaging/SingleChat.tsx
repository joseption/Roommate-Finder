import { ArrowBackIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";

import { GetMessages } from "../../request/fetch";
import { SendMessage } from "../../request/mutate";
import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { message } from "../../types/message.types";
import BlockModal from "./BlockModal";
import { ScrollableChat } from "./ScrollableChat";
interface Props {
  userId: string;
  selectedChat: chat;
  setSelectedChat: Dispatch<SetStateAction<chat | null>> | undefined;
  selectedChatUser?: user;
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}

const ENDPOINT = "https://api.roomfin.xyz";
// const ENDPOINT = "http://localhost:8080";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  selectedChatCompare: chat;
export const SingleChat = ({
  selectedChat,
  selectedChatUser,
  setSelectedChat,
  userId,
  fetchAgain,
  setFetchAgain,
}: Props) => {
  const [messages, setMessages] = useState<message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [blocked, setBlocked] = useState(
    selectedChat.blocked === null ? false : true
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = ["messages", selectedChat.id];
  const { data, isLoading } = useQuery(queryKey, {
    // add chat id
    queryFn: () => GetMessages(selectedChat.id),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: (data) => {
      setMessages(data as message[]);
      socket.emit("join chat", selectedChat.id);
      selectedChatCompare = selectedChat;
    },
  });

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userId);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    return () => {
      // Clean up event listeners
      socket.off("message received");
      socket.off("block received");
      socket.off("unblock received");

      // Disconnect WebSocket
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived: message) => {
      if (selectedChat.id !== newMessageReceived.chatId) {
        // * Give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [messages, selectedChat.id]);

  useEffect(() => {
    const handleBlockReceived = (chatId: string) => {
      console.log("block received");
      setBlocked(true);
      selectedChat.blocked = userId;
      socket.disconnect();
      // ! chose to not disconnect because it makes it more responsive to block then unblock. However is already on the connection they'll be able to msg you
    };

    socket.on("block received", handleBlockReceived);

    return () => {
      socket.off("block received", handleBlockReceived);
    };
  }, [selectedChat, userId]);

  useEffect(() => {
    const handleUnblockReceived = (chatId: string) => {
      socket.connect();
      console.log("received unblock");
      setBlocked(false);
      selectedChat.blocked = null;
    };

    socket.on("unblock received", handleUnblockReceived);

    return () => {
      socket.off("unblock received", handleUnblockReceived);
    };
  }, [selectedChat, userId]);

  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: (content: string) => {
      setNewMessage("");
      return SendMessage(content, selectedChat.id, userId);
    },
    onSuccess: (data) => {
      console.log(data.content, "msg hit");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  const sendMessage = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && newMessage) {
      try {
        console.log(selectedChat.blocked, "blocked");
        if (selectedChat.blocked === null) {
          sendMessageMutation(newMessage);
          socket.emit("new message", {
            content: newMessage,
            chatId: selectedChat.id,
            userId: userId,
          });
          setMessages([
            ...messages,
            { content: newMessage, chatId: selectedChat.id, userId: userId },
          ]);
        } else {
          setNewMessage("");
        }
      } catch (err) {
        console.log(err, "error");
      }
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };
  const [showblockmodal, setShowblockmodal] = useState(false);
  function blockChat() {
    setShowblockmodal(true);
  }
  return (
    <>
      {Object.keys(selectedChat).length > 0 ? (
        <>
          {showblockmodal && (
            <BlockModal
              userId={userId}
              chatId={selectedChat.id}
              blocked={blocked}
              showblockmodal={showblockmodal}
              setShowblockmodal={setShowblockmodal}
              socket={socket}
            />
          )}
          <div className="flex">
            <IconButton
              aria-label="back button"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat?.({} as chat)}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              {selectedChatUser?.first_name}
            </Text>
            <IconButton
              aria-label="block button"
              icon={<NotAllowedIcon />}
              onClick={blockChat}
              hidden={
                selectedChat.blocked !== null &&
                selectedChat?.blocked !== userId
              }
            />
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="gray.100"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {isLoading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="flex flex-col overflow-auto">
                <ScrollableChat
                  key={selectedChat.id}
                  messages={messages}
                  userId={userId}
                  selectedChatUser={selectedChatUser}
                />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
                isDisabled={blocked}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text className="font-sans text-3xl">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
