import React, { Fragment } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Food Feels
        </h1>
        { process.env.NODE_ENV === 'production' ?
            <p>
              Website coming soon!
            </p>
          : <Fragment>
              <p>
                This is the developer-mode of Food Feels.
              </p>
              <form method="post" action="/api/restaurants">
              <label>Add a Restaurant</label><br />
              <input type="text" name="name" placeholder="Name" required /> <br />
              <input type="text" name="playlist" placeholder="Music Playlist" required /> <br />
              <input type="text" name="lighting" placeholder="Lighting" required /> <br />
              <input type="text" name="scent" placeholder="Aromas" required /> <br />
              <input type="submit" value="Submit" />
              </form>
          </Fragment>
        }
      </header>
    </div>
  );

}

export default App;
