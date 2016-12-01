import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import './AppHeader.css'

const RangePicker = DatePicker.RangePicker;

class AppHeader extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header-elements">
          <img src="https://webpanels.jugnoo.in/analytics_front/app/images/logo_nav_bar.png"
            className="App-logo" alt="logo" />
          <DateRange className="RangePicker" onDateChange={this.props.onDateChange} />
        </div>
      </div>
    );
  }
}
class DateRange extends Component {

  render() {
    return (
      <RangePicker
        ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
        style={{ margin: "auto" }}
        onChange={this.props.onDateChange} />
    );
  }
}

export default AppHeader;