import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { useChatContext } from '@/contexts/chat-context';
import { ChatFile } from './File';
import { ChatMessage } from './Message';
import { ChatReasoning } from './Reasoning';

export const ChatConversation = () => {
  const { chat } = useChatContext();
  const { messages, status, error } = useChat({ chat });

  return (
    <Conversation className="border rounded-xl">
      <ConversationContent>
        {messages.map((message) => (
          <div key={message.id}>
            {/* Отображаем текстовые части сообщения */}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return (
                    <ChatMessage
                      key={`${message.id}-${i}`}
                      idx={i}
                      text={part.text}
                      message={message}
                    />
                  );
                case 'reasoning':
                  return (
                    <ChatReasoning
                      key={`${message.id}-${i}`}
                      text={part.text}
                    />
                  );
                default:
                  return null;
              }
            })}

            {/* Отображаем файлы отдельно после сообщения */}
            {message.role === 'user' && (
              <div className="flex flex-wrap gap-2 mb-4 justify-end h-16 relative">
                {message.parts
                  .filter((part) => part.type === 'file')
                  .map((part, i) => (
                    <ChatFile key={`${message.id}-file-${i}`} filePart={part} />
                  ))}
              </div>
            )}
          </div>
        ))}

        {error && <div>Произошла ошибка: {error.message}</div>}
        {status === 'submitted' && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};
