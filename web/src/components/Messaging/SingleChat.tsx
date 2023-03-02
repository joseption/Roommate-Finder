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
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";

import { GetMessages } from "../../request/fetch";
import { SendMessage } from "../../request/mutate";
import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { message } from "../../types/message.types";
import { ScrollableChat } from "./ScrollableChat";
interface Props {
  userId: string;
  selectedChat: chat;
  setSelectedChat?: Dispatch<SetStateAction<chat>> | undefined;
  selectedChatUser?: user;
}

const ENDPOINT = "https://api.roomfin.xyz";
let socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  selectedChatCompare: chat;

export const SingleChat = ({
  selectedChat,
  selectedChatUser,
  setSelectedChat,
  userId,
}: Props) => {
  const { data, isLoading } = useQuery(["messages", selectedChat.id], {
    // add chat id
    queryFn: () => GetMessages(selectedChat.id),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
    // refetchOnMount: true,
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
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived: message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare.id !== newMessageReceived.chatId
      ) {
        // * Give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const [messages, setMessages] = useState<message[]>([]);
  const [loading, setLoading] = useState(false); // * use react query builtin loading
  const [newMessage, setNewMessage] = useState<string>("");
  const [socketConnected, setSocketConnected] = useState(false);
  // const [typing, setTyping] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);

  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: (content: string) => {
      setNewMessage("");
      // socket.emit("stop typing", selectedChat.id);
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
      } catch (err) {
        console.log(err, "error");
      }
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    // * add typing indicator logic
    // if (!socketConnected) return;
    // if (typing) return;
    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat.id);
    // }
    // const lastTypingTime = new Date().getTime();
    // const timerLength = 3000;
    // setTimeout(() => {
    //   const timeNow = new Date().getTime();
    //   const timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat.id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  return (
    <>
      {Object.keys(selectedChat).length > 0 ? (
        <>
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
              {selectedChatUser?.email}
            </Text>
            <IconButton
              aria-label="block button"
              icon={<NotAllowedIcon />}
              //   onClick={}
            />
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="lightgray"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll">
                <ScrollableChat
                  messages={messages}
                  userId={userId}
                  selectedChatUser={selectedChatUser}
                />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {/* {isTyping ? <div>Loading...</div> : <></>} */}
              <Input
                variant="filled"
                bg="E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
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
