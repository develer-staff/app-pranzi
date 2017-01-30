'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import { uiblocks } from '../globstyle';

import { formatTimeParts } from '../utils.js';

export default class CustomTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { pickerVisible: false };
    this.showPicker = this.showPicker.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
    this.onTimeConfirm = this.onTimeConfirm.bind(this);
  }

  showPicker() {
    this.setState({ pickerVisible: true });
  }

  hidePicker() {
    this.setState({ pickerVisible: false });
  }

  onTimeConfirm(date) {
    if (this.props.onSelected) {
      this.props.onSelected([date.getHours(), date.getMinutes()]);
    }

    this.setState({ pickerVisible: false });
  }

  render() {
    const { hour, minute } = this.props;
    const timeString = formatTimeParts(hour) + ':' + formatTimeParts(minute);
    const dt = new Date();
    dt.setHours(formatTimeParts(hour));
    dt.setMinutes(formatTimeParts(minute));

    return (
      <View style={defaultStyle.container}>
        <TouchableOpacity style={defaultStyle.button}
                          onPress={this.showPicker}
                          >
          <Text style={defaultStyle.text}>{timeString}</Text>
        </TouchableOpacity>
        <DateTimePicker isVisible={this.state.pickerVisible}
                        titleIOS={'Select Time'}
                        mode={'time'}
                        date={dt}
                        onConfirm={this.onTimeConfirm}
                        onCancel={this.hidePicker}
                        />
      </View>
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
  container: {
    alignSelf: 'stretch',
  },
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
