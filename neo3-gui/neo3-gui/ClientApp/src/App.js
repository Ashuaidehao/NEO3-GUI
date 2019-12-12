import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReconnectingWebSocket from 'reconnecting-websocket';

//demo
const rws = new ReconnectingWebSocket('ws://localhost:8081/');

rws.addEventListener('open', () => {
    rws.send('1111');
});

rws.onmessage = function(e) {
  console.log(e.type + ":" + e.data);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
