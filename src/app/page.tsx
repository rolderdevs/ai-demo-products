'use client';

import Chat from '@/components/app/chat/Chat';
import { ChatProvider } from '@/contexts/chat-context';

export default function Home() {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
}
