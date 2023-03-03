export interface chat {
  id: string;
  chatName: string;
  isGroupChat: boolean;
  users: string[];
  latestMessage: string;
  groupAdmin?: string;
  createdAt: string;
  updatedAt: string;
  blocked?: string;
}
