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
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ date });
    this.props.onDateChange(date);
  }

  render() {
    return (
      <View style={styles.container}>
        <DatePickerIOS date={this.state.date}
          onDateChange={this.onDateChange}
          maximumDate={new Date()}
          mode="date" />
      </View>
    );
  }
}

SelectDate.propTypes = {
  date: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 60,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
});

