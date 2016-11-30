import React, { Component } from 'react';

import './App.css';
import AppHeader from './AppHeader';
import Panel from './Panel';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppHeader />
        <div className="Graphs">
          <Panel />
        </div>
      </div>
    );
  }
}

export default App;
