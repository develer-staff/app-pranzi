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
    const timeString = formatTimeParts(hour) + ':' + this.formatTimeParts(minute);
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
