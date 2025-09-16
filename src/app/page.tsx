'use client';

import Chat from '@/components/app/chat/Chat';
import { TableArtifact } from '@/components/app/table';
import { ChatProvider } from '@/contexts/chat-context';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex flex-row gap-10 p-6 h-screen">
        <Chat />
        <TableArtifact />
      </div>
    </ChatProvider>
  );
}
