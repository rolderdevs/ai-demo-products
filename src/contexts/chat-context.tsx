'use client';

import { Chat, useChat } from '@ai-sdk/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DefaultChatTransport, type UIMessage } from 'ai';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Row } from '@/ai/shema';
import { processMessage } from '@/lib/processMessage';

interface ChatContextValue {
  chat: Chat<UIMessage>;
  clearChat: () => void;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  columns: ColumnDef<Row>[];
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
  const { messages } = useChat({ chat });

  const [rows, setRowsState] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnDef<Row>[]>([]);

  const setRows = (data: Row[]) => {
    tableDataRef.current = data;
    setRowsState(data);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'assistant') {
      return;
    }

    for (const part of lastMessage.parts) {
      if (part.type === 'text') {
        processMessage(part).then((message) => {
          if (message.tableColumns && message.tableRows) {
            setRowsState(message.tableRows);
            tableDataRef.current = message.tableRows;
            setColumns(message.tableColumns);
          }
        });
      }
    }
  }, [messages]);

  const clearChat = () => {
    setChat(createChat(() => tableDataRef.current));
    setRowsState([]);
    setColumns([]);
    tableDataRef.current = null;
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        clearChat,
        rows,
        setRows,
        columns,
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
