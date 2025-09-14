import { ChatConversation } from './conversation/Conversation';
import { ChatInput } from './input/Input';

export default function Chat() {
  return (
    <div className="p-6 size-full h-screen flex gap-10">
      <div className="h-full w-xl flex flex-col gap-4">
        <ChatConversation />
        <ChatInput />
      </div>
    </div>
  );
}
