import React from 'react';
import { Route } from 'react-router';
import NewsPage from './pages/NewsPage';

function App() {
  /*
  const [category, setCategory] = useState<string>('all');
  const onSelect = useCallback((category: string) => {
    setCategory(category);
  }, []);
  */

  return <Route path="/:category?" component={NewsPage} />;
}

export default App;
