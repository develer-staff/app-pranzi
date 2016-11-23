'use strict';

import React, { Component, PropTypes } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { uiblocks } from '../globstyle';

export default class ToggleButton extends Component {
  render() {
    const { isPressed, onPress, text } = this.props;
    const style = [ defaultStyle.enabled, isPressed ? defaultStyle.pressed : null ];

    return (
      <TouchableOpacity
        style={ style }
        onPress={ onPress }
        >
        <Text style={ defaultStyle.text }>{ text }</Text>
      </TouchableOpacity>
    );
  }
}

ToggleButton.propTypes = {
  isPressed: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const { enabled, pressed, text } = uiblocks.button;

const defaultStyle = StyleSheet.create({
  enabled: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 10,
    ...enabled
  },
  pressed: {
    ...pressed
  },
  text: {
    alignSelf: 'center',
    ...text
  }
});
