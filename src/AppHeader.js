import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment-range'

import './AppHeader.css'

const RangePicker = DatePicker.RangePicker;

class AppHeader extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header-elements">
          <img src="https://webpanels.jugnoo.in/analytics_front/app/images/logo_nav_bar.png"
            className="App-logo" alt="logo" />
          <DateRange className="RangePicker"
            onDateChange={(dateString) => { this.props.onDateChange(dateString) } } />
        </div>
      </div>
    );
  }
}
class DateRange extends Component {

  render() {
    return (
      <RangePicker
        defaultValue={[moment('2015-01-01', 'YYYY-MM-DD'), moment().subtract(1, 'day')]}
        ranges={{ Today: [moment().subtract(1, 'day'), moment().subtract(1, 'day')], 'This Month': [moment().subtract(31, 'day'), moment().subtract(1, 'day')] }}
        style={{ margin: "auto" }}
        onChange={(date, dateString) => { this.props.onDateChange(dateString) } } />
    );
  }
}

export default AppHeader;