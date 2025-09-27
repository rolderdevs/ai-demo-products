// import { useChat } from '@ai-sdk/react';
import { css } from '@rolder/ss/css';
import { Button, Message, StreamResponse } from '@rolder/ui-kit-react';
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
        <StreamResponse
          speed={10}
          text={parsedText}
          animate={message.role === 'assistant'}
          markdown={message.role === 'assistant'}
        />
      </Message.Content>
    </Message>
  );
};

/*{message.role === 'assistant' && idx === message.parts.length - 1 && (
  <Actions style={{ marginTop: '-10px' }}>
    <Action onClick={() => regenerate()} label="Повторить">
      <RefreshCcwIcon className={css({ w: 3, h: 3 })} />
    </Action>
    <Action
      onClick={() => navigator.clipboard.writeText(parsedText)}
      label="Копировать"
    >
      <CopyIcon className={css({ w: 3, h: 3 })} />
    </Action>
  </Actions>
)}*/
