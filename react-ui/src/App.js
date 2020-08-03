import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        { process.env.NODE_ENV === 'production' ?
            <p>
              This is a production build of Food Feels. App coming soon!
            </p>
          : <p>
              This is the developer-mode of Food Feels.
            </p>
        }
        {isFetching
          ? 'Fetching message from API'
          : 'Server Status: ' + message
        }
      </header>
    </div>
  );

}

export default App;
