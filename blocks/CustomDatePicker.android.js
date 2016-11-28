'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  DatePickerAndroid,
} from 'react-native';

import { uiblocks } from '../globstyle';

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    this.onSelectDatePressed = this.onSelectDatePressed.bind(this);
  }

  onSelectDatePressed() {
    try {
      const { date, minDate, maxDate } = this.props;
      const opts = {
        date: date
      };

      if (minDate) {
        opts.minDate = minDate;
      }

      if (maxDate) {
        opts.maxDate = maxDate;
      }

      DatePickerAndroid.open(opts)
        .then((result) => {
          const {action, year, month, day} = result;

          if (action !== DatePickerAndroid.dismissedAction) {
            this.props.onSelected(new Date(year, month, day));
          }
        }, (error) => {
          console.error('Error on datePicker ', error);
        });
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  formatDateParts(datePart) {
    return datePart >= 10 ? datePart : '0' + datePart;
  }

  render() {
    const { date } = this.props;

    const day = this.formatDateParts(date.getDate());
    const month = this.formatDateParts((date.getMonth() + 1));
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
    flex: 1,
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
