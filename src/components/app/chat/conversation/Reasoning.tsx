import { useChat } from '@ai-sdk/react';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { useChatContext } from '@/contexts/chat-context';

export const ChatReasoning = ({ text }: { text: string }) => {
  const { chat } = useChatContext();
  const { status } = useChat({ chat });

  return (
    <Reasoning
      className="w-full"
      isStreaming={status === 'streaming'}
      defaultOpen={false}
    >
      <ReasoningTrigger />
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  );
};
