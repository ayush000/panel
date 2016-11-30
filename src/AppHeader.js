import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import './AppHeader.css'

const RangePicker = DatePicker.RangePicker;

class AppHeader extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header-elements">
          <img src="https://webpanels.jugnoo.in/analytics_front/app/images/logo_nav_bar.png"
            className="App-logo" alt="logo" />
          <DateRange className="RangePicker" />
        </div>
      </div>
    );
  }
}
class DateRange extends Component {

  onChange(dates, dateStrings) {
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  render() {
    return (
      <RangePicker
        ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
        style={{margin: "auto"}}
        onChange={this.onChange} />
    );
  }
}

export default AppHeader;