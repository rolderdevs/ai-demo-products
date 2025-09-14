import { ChatConversation } from './conversation/Conversation';
import { ChatInput } from './input/Input';

export default function Chat() {
  return (
    <div className="h-full w-1/5 flex flex-col gap-4">
      <ChatConversation />
      <ChatInput />
    </div>
  );
}
