import { useChat } from '@ai-sdk/react';
import type { TextUIPart, UIMessage } from 'ai';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Action, Actions } from '@/components/ai-elements/actions';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { useChatContext } from '@/contexts/chat-context';
import { processMessage } from '@/lib/processMessage';

export const ChatMessage = ({
  message,
  part,
  idx,
}: {
  message: UIMessage;
  part: TextUIPart;
  idx: number;
}) => {
  const { chat } = useChatContext();
  const { regenerate } = useChat({ chat });

  const [parsedText, setParsedText] = useState('');

  useEffect(() => {
    processMessage(part).then((message) => setParsedText(message.text));
  }, [part]);

  return (
    <Fragment key={`${message.id}-${idx}`}>
      <Message from={message.role}>
        <MessageContent>
          <Response>{parsedText}</Response>
        </MessageContent>
      </Message>
      {message.role === 'assistant' && idx === message.parts.length - 1 && (
        <Actions style={{ marginTop: '-10px' }}>
          <Action onClick={() => regenerate()} label="Повторить">
            <RefreshCcwIcon className="size-3" />
          </Action>
          <Action
            onClick={() => navigator.clipboard.writeText(parsedText)}
            label="Копировать"
          >
            <CopyIcon className="size-3" />
          </Action>
        </Actions>
      )}
    </Fragment>
  );
};
