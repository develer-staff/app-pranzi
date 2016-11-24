'use strict';

import React, { Component, PropTypes } from 'react';

import {
  DatePickerIOS,
  StyleSheet,
  View
} from 'react-native';

export default class SelectDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date
    };
    this.onDateChanged = this.onDateChanged.bind(this);
  }

  onDateChanged(date) {
    this.setState({ date });
    this.props.onDateChanged(date);
  }

  render() {
    return (
      <View style={styles.container}>
        <DatePickerIOS date={this.state.date}
          onDateChange={this.onDateChanged}
          maximumDate={new Date()}
          mode="date" />
      </View>
    );
  }
}

SelectDate.propTypes = {
  date: PropTypes.object.isRequired,
  onDateChanged: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 60,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
});

