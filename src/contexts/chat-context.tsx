'use client';

import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import type { Row } from '@/ai/shema';

interface ChatContextValue {
  // replace with your custom message type
  chat: Chat<UIMessage>;
  clearChat: () => void;
  setTableData: (rows: Row[] | null) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(getTableData: () => Row[] | null) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
        const tableData = getTableData();
        return {
          body: {
            messages,
            trigger,
            messageId,
            ...(tableData && { tableData }),
          },
        };
      },
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const tableDataRef = useRef<Row[] | null>(null);
  const [chat, setChat] = useState(() =>
    createChat(() => tableDataRef.current),
  );

  const clearChat = () => {
    setChat(createChat(() => tableDataRef.current));
  };

  const setTableData = (data: Row[] | null) => {
    tableDataRef.current = data;
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        clearChat,
        setTableData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
