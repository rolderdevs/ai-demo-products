import { useChat } from '@ai-sdk/react';
import { Conversation, Loader } from '@rolder/ui-kit-react';
import { IconMessageUser } from '@tabler/icons-react';
import { useChatContext } from '@/contexts';
import { HStack, VStack } from '~ss/jsx';
import { ChatFile } from './ChatFile';
import { ChatMessage } from './ChatMessage';
import { ChatReasoning } from './ChatReasoning';

export const ChatConversation = () => {
  const { chat } = useChatContext();
  const { messages, status, error } = useChat({ chat });

  return (
    <Conversation height="calc(100vh - 170px)">
      <Conversation.Content>
        {messages.length === 0 ? (
          <Conversation.EmptyState icon={<IconMessageUser size={28} />} />
        ) : (
          messages.map((message, messageIndex) => (
            <VStack key={message.id}>
              {message.parts.map((part, i) => {
                const isLastMessage = messageIndex === messages.length - 1;
                const isStreaming = status === 'streaming' && isLastMessage;

                switch (part.type) {
                  case 'text': {
                    return (
                      <ChatMessage
                        key={`${message.id}-${i}`}
                        idx={i}
                        part={part}
                        message={message}
                      />
                    );
                  }
                  case 'reasoning':
                    return (
                      <ChatReasoning
                        key={`${message.id}-${i}`}
                        text={part.text}
                        isStreaming={isStreaming}
                      />
                    );
                  default:
                    return null;
                }
              })}

              {message.role === 'user' &&
                message.parts.some((p) => p.type === 'file') && (
                  <HStack
                    pos="relative"
                    // gap={2}
                    mb={4}
                    justifyContent="end"
                    h={16}
                  >
                    {message.parts
                      .filter((part) => part.type === 'file')
                      .map((part, i) => (
                        <ChatFile
                          key={`${message.id}-file-${i}`}
                          filePart={part}
                        />
                      ))}
                  </HStack>
                )}
            </VStack>
          ))
        )}

        {error && <div>Произошла ошибка: {error.message}</div>}
        {status === 'submitted' && <Loader alignSelf="flex-start" />}
      </Conversation.Content>

      <Conversation.ScrollButton />
    </Conversation>
  );
};
