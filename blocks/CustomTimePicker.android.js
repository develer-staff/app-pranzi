'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TimePickerAndroid,
} from 'react-native';

import { uiblocks } from '../globstyle';

export default class CustomTimePicker extends Component {
  constructor(props) {
    super(props);
    this.onSelectHourPressed = this.onSelectHourPressed.bind(this);
  }

  onSelectHourPressed() {
    try {
      const { hour, minute } = this.props;
      const opts = {
        hour: hour,
        minute: minute,
        is24Hour: true,
      };

      TimePickerAndroid.open(opts)
        .then((result) => {
          const {action, hour, minute} = result;

          if (action !== TimePickerAndroid.dismissedAction) {
            this.props.onSelected([hour, minute]);
          }
        }, (error) => {
          console.error('Error on timePicker ', error);
        });
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  formatTimeParts(timePart) {
    return timePart >= 10 ? timePart : '0' + timePart;
  }

  render() {
    const { hour, minute } = this.props;
    const timeString = this.formatTimeParts(hour) + ':' + this.formatTimeParts(minute);
    return (
      <TouchableOpacity style={defaultStyle.button} onPress={this.onSelectHourPressed}>
        <Text style={defaultStyle.text}>{timeString}</Text>
      </TouchableOpacity>
    );
  }
}

CustomTimePicker.propTypes = {
  hour: PropTypes.number.isRequired,
  minute: PropTypes.number.isRequired,
  onSelected: PropTypes.func.isRequired,
};

const { enabled, text } = uiblocks.button;

const defaultStyle = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginRight: 5,
    padding: 4,
    ...enabled
  },
  text: {
    alignSelf: 'center',
    ...text
  }
});
