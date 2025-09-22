// import { useChat } from '@ai-sdk/react';
import { Button, Message, Response } from '@rolder/ui-kit-react';
import type { TextUIPart, UIMessage } from 'ai';
import { Fragment, useEffect, useState } from 'react';
// import { useChatContext } from '@/contexts';
import { processMessage } from '@/utils';

export const ChatMessage = ({
  message,
  part,
  idx,
}: {
  message: UIMessage;
  part: TextUIPart;
  idx: number;
}) => {
  // const { chat } = useChatContext();
  // const { regenerate } = useChat({ chat });

  const [parsedText, setParsedText] = useState('');

  useEffect(() => {
    processMessage(part).then((message) => setParsedText(message.text));
  }, [part]);

  return (
    <Message from={message.role}>
      <Message.Content>
        <Response>{parsedText}</Response>
      </Message.Content>
    </Message>
  );
};

/*{message.role === 'assistant' && idx === message.parts.length - 1 && (
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
)}*/
