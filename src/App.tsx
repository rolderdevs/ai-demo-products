import './App.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import { HStack, VStack } from '@rolder/ss/jsx';
import { ChatConversation, ChatInput } from './components';

const App = () => {
  return (
    <HStack h="screen" w="full" p={6}>
      <VStack h="full" w="3/12">
        <ChatConversation />
        <ChatInput />
      </VStack>
    </HStack>
  );
};

export default App;
