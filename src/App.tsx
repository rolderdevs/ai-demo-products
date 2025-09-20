import './App.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import { useChat } from '@ai-sdk/react';
import { Button } from '@rolder/ui-kit-react';
import { useEffect, useState } from 'react';
import { Box, VStack } from '~ss/jsx';

const App = () => {
  const [input, setInput] = useState('');
  const { messages, setMessages, sendMessage, status, error } = useChat();

  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        parts: [{ text: 'Привет! Чем помочь?', type: 'text' }],
      },
    ]);
  }, [setMessages]);

  const handleSubmit = async (message: { text: string; files?: File[] }) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (error != null) {
      setMessages(messages.slice(0, -1)); // remove last message
    }

    sendMessage({
      text: message.text || 'Отправлены файлы',
    });
    setInput('');
  };

  return (
    <VStack>
      {messages.map((message) => (
        <Box key={message.id}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text': {
                return <Box key={`${message.id}-${i}`}>{part.text}</Box>;
              }
              case 'reasoning':
                return (
                  <Box key={`${message.id}-${i}`}>Reasoning: {part.text}</Box>
                );
              default:
                return null;
            }
          })}
        </Box>
      ))}

      <textarea
        onChange={(e) => setInput(e.target.value)}
        // autoFocus
        value={input}
        placeholder="Введите сообщение..."
      />

      <Button onClick={() => handleSubmit({ text: input })}>Отправить</Button>

      {error && <div>Произошла ошибка: {error.message}</div>}
      {status === 'submitted' && <Box>Loading...</Box>}
    </VStack>
  );
};

export default App;
