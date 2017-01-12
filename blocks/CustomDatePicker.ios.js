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

import I18n from 'react-native-i18n';

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
      title: I18n.t('selectDate'),
      component: SelectDate,
      passProps: {
        date: this.props.date,
        onDateChanged: this.onDateChanged
      },
    });
  }

  render() {
    const { date } = this.props;
    console.log(date);

    const day = formatTimeParts(date.getDate());
    const month = formatTimeParts((date.getMonth() + 1));
    const year = date.getFullYear();

    const dateString = date.toDateString() === new Date().toDateString() ? I18n.t('today') : day + '/' + month + '/' + year;

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
