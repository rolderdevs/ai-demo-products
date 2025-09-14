import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { Fragment } from 'react';
import { Action, Actions } from '@/components/ai-elements/actions';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { useChatContext } from '@/contexts/chat-context';

export const ChatMessage = ({
  message,
  text,
  idx,
}: {
  message: UIMessage;
  text: string;
  idx: number;
}) => {
  const { chat } = useChatContext();
  const { regenerate } = useChat({ chat });

  return (
    <Fragment key={`${message.id}-${idx}`}>
      <Message from={message.role}>
        <MessageContent>
          <Response>{text}</Response>
        </MessageContent>
      </Message>
      {message.role === 'assistant' && idx === message.parts.length - 1 && (
        <Actions style={{ marginTop: '-10px' }}>
          <Action onClick={() => regenerate()} label="Повторить">
            <RefreshCcwIcon className="size-3" />
          </Action>
          <Action
            onClick={() => navigator.clipboard.writeText(text)}
            label="Копировать"
          >
            <CopyIcon className="size-3" />
          </Action>
        </Actions>
      )}
    </Fragment>
  );
};
