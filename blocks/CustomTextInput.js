'use strict';

import React, { Component, PropTypes } from 'react';

import {
  TextInput,
  StyleSheet
} from 'react-native';

import { uiblocks } from '../globstyle';

export default class CustomTextInput extends Component {

  render() {
    const { style, value, onChangeText } = this.props;
    const styles = [defaultStyle.input, style];

    return (
      <TextInput style={styles}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid={'transparent'}
      />
    );
  }
}

CustomTextInput.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  style: PropTypes.number
};

const { textInput } = uiblocks;

const defaultStyle = StyleSheet.create({
  input: {
    textAlign: 'center',
    ...textInput
  }
});
