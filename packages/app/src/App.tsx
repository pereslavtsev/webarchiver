import React from 'react';
import logo from './logo.svg';
import './App.css';
import {grpc} from "@improbable-eng/grpc-web";

import { GrpcWebImpl, PagesServiceClientImpl, PagesServiceGetPageDesc } from "./__generated__/pages/pages_service";

const rpc = new GrpcWebImpl('http://0.0.0.0:8081', {
});
// grpc.unary(PagesServiceGetPageDesc, {})
const client = new PagesServiceClientImpl(rpc);

client.ListPages({ limit: 10, offset: 0 }).then(value => console.log(value))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
