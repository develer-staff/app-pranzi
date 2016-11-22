'use strict';

import React, { Component, PropTypes } from 'react';

import {
  TextInput,
  StyleSheet
} from 'react-native';

import { uiblocks } from '../globstyle';


export default class CustomTextInput extends Component{

  render(){
    const { style, value, onChangeText } = this.props;
    var styles = [defaultStyle.input, style];

    return(
      <TextInput style={styles}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid={'transparent'}
      />
    );
  }
}


CustomTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired
}

const { textInput } = uiblocks;

const defaultStyle = StyleSheet.create({
  input: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    textAlign: 'center',
    ...textInput
  }
});
