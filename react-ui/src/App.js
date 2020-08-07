import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

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
        <h1>
          Food Feels
        </h1>
        { process.env.NODE_ENV === 'production' ?
            <p>
              This is a production build of Food Feels. App coming soon!
            </p>
          : <p>
              This is the developer-mode of Food Feels.
            </p>
        }

        {/* only for testing */}
        <form method="post" action="/api/restaurants/add">
          <label>Add a Restaurant</label><br />
          <input type="text" name="name" placeholder="Name" required /> <br />
          <input type="text" name="playlist" placeholder="Music Playlist" required /> <br />
          <input type="text" name="lighting" placeholder="Lighting" required /> <br />
          <input type="text" name="scent" placeholder="Aromas" required /> <br />
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );

}

export default App;
