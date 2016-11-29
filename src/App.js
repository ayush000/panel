import React, { Component } from 'react';
// import "../node_modules/react-vis/main.css";
import _ from 'lodash'
// import { Table } from 'react-vis';
import { CartesianGrid, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import logo from './logo.svg';
import './App.css';

// const data = [
//   { name: '2016-01-01', uv: 1000, pv: 2400, amt: 2400 },
//   { name: '2016-01-02', uv: 300, pv: 4567, amt: 2400 },
//   { name: '2016-01-03', uv: 280, pv: 1398, amt: 2400 },
//   { name: '2016-01-04', uv: 200, pv: 9800, amt: 2400 },
//   { name: '2016-01-05', uv: 278, pv: 3908, amt: 2400 },
//   { name: '2016-01-06', uv: 189, pv: 4800, amt: 2400 },
//   { name: '2016-01-07', uv: 189, pv: 4800, amt: 2400 },
//   { name: '2016-01-08', uv: 189, pv: 4800, amt: 2400 },
//   { name: '2016-01-09', uv: 189, pv: 4800, amt: 2400 },
//   { name: '2016-01-10', uv: 189, pv: 4800, amt: 2400 },
// ];

// const baseUrl = 'https://prod-analytics-in.jugnoo.in:8083';
const baseUrl = 'http://localhost:8081';
const colors = ["#023fa5", "#7d87b9", "#bec1d4",
  "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3",
  "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91",
  "#d33f6a", "#11c638", "#8dd593", "#c6dec7",
  "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0",
  "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"];
// class LineGroup extends Component {
//   constructor() {
//     super();
//     this.state = {
//       data: null,
//     };
//   }
//   render() {
//     console.log(this.props.columns);

//     return (
//       <div>

//       </div>
//     );
//   }
// }

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      rows: [],
      columns: [],
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
        this.setState({ columns: _.without(Object.keys(this.state.rows[0]), ['timing', 'columnsCount']) });
      })
      .catch(error => {
        throw error;
      });
  }
  // render() {
  //   return (<Table
  //     height={300}
  //     width={400}
  //     data={[
  //       [1, 2, 3, 4, 5],
  //       ['one', 'two', 'three', 'four', 'five']
  //     ]}
  //     header={
  //       ['h1', 'h2', 'h3', 'h4', 'h5']
  //     } />);
  // }
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
              <Tooltip />
              <Legend />
              {this.props.data.columnNames.map((col, i) =>
                <Line key={col} type="monotone"
                  dataKey={this.state.columns[i]}
                  name={col} stroke={colors[i % colors.length]} />)}
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
          )};
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
