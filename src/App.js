import React, { Component } from 'react';

import './App.css';
import AppHeader from './AppHeader';
import Panel from './Panel';
import moment from 'moment'

class App extends Component {
  constructor() {
    super();
    this.state = {
      from_date: '2015-01-01',
      to_date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    }
  }

  render() {
    return (
      <div className="App">
        <AppHeader onDateChange={(dateStrings) => {
          this.setState({ from_date: dateStrings[0], to_date: dateStrings[1] });
        } } />
        <div className="Graphs">
          <Panel from_date={this.state.from_date} to_date={this.state.to_date} />
        </div>
      </div>
    );
  }
}

export default App;
