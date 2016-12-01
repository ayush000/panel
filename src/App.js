import React, { Component } from 'react';

import './App.css';
import AppHeader from './AppHeader';
import Panel from './Panel';

class App extends Component {
  
  handleDateChange(dates, dateStrings) {
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  render() {
    return (
      <div className="App">
        <AppHeader onDateChange={this.handleDateChange} />
        <div className="Graphs">
          <Panel />
        </div>
      </div>
    );
  }
}

export default App;
