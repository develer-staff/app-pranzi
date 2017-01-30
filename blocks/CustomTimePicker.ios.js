'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { uiblocks } from '../globstyle';

import { formatTimeParts } from '../utils.js';

export default class CustomTimePicker extends Component {
  constructor(props) {
    super(props);
    this.onSelectHourPressed = this.onSelectHourPressed.bind(this);
  }

  onSelectHourPressed() {

  }

  render() {
    const { hour, minute } = this.props;
    const timeString = formatTimeParts(hour) + ':' + formatTimeParts(minute);
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
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 4,
    alignItems: 'center',
    ...enabled
  },
  text: {
    ...text
  }
});
