import { Button } from '@rolder/ui-kit';
import './App.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';

const App = () => {
  return (
    <Button size="xl" m={4} onClick={() => console.log('Clicked')}>
      <span>T</span>
      Загрузить
      <span>T</span>
    </Button>
  );
};

export default App;
