import React, { Component } from 'react';
import update from 'immutability-helper';
import _ from 'lodash'
import { Brush, CartesianGrid, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import logo from './logo.svg';
import './App.css';

const baseUrl = 'https://prod-analytics-in.jugnoo.in:8083';
// const baseUrl = 'http://localhost:8081';
const colors = ["#023fa5", "#7d87b9", "#bec1d4",
  "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3",
  "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91",
  "#d33f6a", "#11c638", "#8dd593", "#c6dec7",
  "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0",
  "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"];

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      columns: [],
      enabled: {},
    }
  }

  componentDidMount() {

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qkey: this.props.qkey,
        token: '1140b56d35b2e2cb78796918f89c1defb4d45079b04fbd542fbc92e6cf7349ad',
        panelId: 11,
        "city[]": '-1',
        "source[]": '-1',
        comparison: false,
        percentileValue: null,
      }),
    };
    fetch(baseUrl + '/getBigQuery', options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        this.setState({ rows: data.result });
        this.setState({ columns: Object.keys(this.state.rows[0]).slice(2) });
        // store true for each legend
        const legendsEnabled = this.state.columns.reduce((obj, elem) => {
          obj[elem] = true;
          return obj;
        }, {});
        // nest legend within qkey
        const enabled = { [this.props.qkey]: legendsEnabled };
        this.setState({ enabled: enabled });
        console.log(this.state.enabled);
      })
      .catch(error => {
        throw error;
      });
  }
  handleClick(i) {
    console.log(i);
    console.log(this.state.enabled[this.props.qkey]);
    this.setState({
      // Set enabled = false for legend clicked
      enabled: update(this.state.enabled, {
        [this.props.qkey]: { [i.dataKey]: { $set: !this.state.enabled[this.props.qkey][i.dataKey] } }
      })
    });
    console.log(this.state.enabled[this.props.qkey]);
  }

  render() {
    if (this.state.columns.length > 0) {
      return (
        <div>
          <h3>{this.props.data.Title}</h3>
          <ResponsiveContainer minHeight={300}>
            <LineChart data={this.state.rows} margin={{ top: 30, right: 50, left: 30, bottom: 5 }}>
              <XAxis dataKey="timing" />
              <YAxis label={this.props.data.yAxisTitle} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip cursor={false} />
              <Legend onClick={i => {
                this.handleClick(i);
              } } verticalAlign="top" height={36} />
              {this.props.data.columnNames
                .filter((col, i) => {
                  // If qkey exists and legend for qkey is enabled
                  if (this.state.enabled[this.props.qkey] &&
                    this.state.enabled[this.props.qkey][this.state.columns[i]]) {
                    return true;
                  }
                  return false;
                })
                .map((col, i) =>
                  // qkey + legend datakey is unique
                  <Line key={`${this.props.qkey} + ${col}`} type="monotone"
                    dot={false}
                    dataKey={this.state.columns[i]}
                    name={col} stroke={colors[i % colors.length]} />)}
              <Brush dataKey='timing' height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return (
      <div>Loading</div>
    )
  }
}

class Panel extends Component {

  constructor() {
    super();
    this.state = {
      graphDetails: null,
    };
  }

  componentDidMount() {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: '1140b56d35b2e2cb78796918f89c1defb4d45079b04fbd542fbc92e6cf7349ad',
        levelId: 10,
        panelId: 11,
      }),
    };

    fetch(baseUrl + '/getQkey', options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        // console.log(data.graphData.godJson);
        this.setState({ graphDetails: _.pick(data.graphData.godJson, ['BurnPerRideGraph', 'DemandQualityData']) });
        // this.setState({ graphDetails: data.graphData.godJson });
      })
      .catch(error => {
        throw error;
      });
  }
  render() {

    if (this.state.graphDetails) {
      return (<div>
        {Object.keys(this.state.graphDetails)
          .map((qkey) =>
            <Graph key={qkey} qkey={qkey} data={this.state.graphDetails[qkey]} />
          )}
      </div>);

    }
    return (
      <div>
        Graphs are loading
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="Graphs">
          <Panel />
        </div>
      </div>
    );
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

export default App;
