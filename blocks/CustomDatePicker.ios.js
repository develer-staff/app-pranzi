'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { uiblocks } from '../globstyle';

import SelectDate from './SelectDate.js';

import { formatTimeParts } from '../utils.js';

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    this.onSelectDatePressed = this.onSelectDatePressed.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
  }

  onDateChanged(date) {
    this.props.onSelected(date);
  }

  onSelectDatePressed() {
    this.props.navigator.push({
      title: 'Select date',
      component: SelectDate,
      passProps: {
        date: this.state.date,
        onDateChanged: this.onDateChanged
      },
      rightButtonTitle: 'Save',
      onRightButtonPress: () => {
        this.setState({ date: this.state.tempDate });
        this.props.navigator.pop();
      },
      onLeftButtonPress: () => {}
    });
  }

  render() {
    const { date } = this.props;
    console.log(date);

    const day = formatTimeParts(date.getDate());
    const month = formatTimeParts((date.getMonth() + 1));
    const year = date.getFullYear();

    const dateString = date.toDateString() === new Date().toDateString() ? 'Today' : day + '/' + month + '/' + year;

    return (
        <TouchableOpacity style={defaultStyle.button} onPress={this.onSelectDatePressed}>
          <Text style={defaultStyle.text}>{dateString}</Text>
        </TouchableOpacity>
    );
  }
}

CustomDatePicker.propTypes = {
  navigator: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

const { enabled, text } = uiblocks.button;

const defaultStyle = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 10,
    ...enabled
  },
  text: {
    alignSelf: 'center',
    ...text
  }
});
