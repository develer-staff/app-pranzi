'use strict';

import React, { Component, PropTypes } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { uiblocks } from '../globstyle';

export default class CanDisableButton extends Component {
  render() {
    const { disabled, opacityCondition, onPress, text } = this.props;
    const style = [defaultStyle.enabled, disabled ? defaultStyle.disabled : null];

    return (
      <TouchableOpacity style={ style }
        activeOpacity={ opacityCondition ? 1 : 0.2 }
        disabled={ disabled }
        onPress={ onPress }>
        <Text style={defaultStyle.text}>{ text }</Text>
      </TouchableOpacity>
    );
  }
}

CanDisableButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  opacityCondition: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const { enabled, disabled, text } = uiblocks.button;

const defaultStyle = StyleSheet.create({
  enabled: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    ...enabled
  },
  disabled: {
    ...disabled
  },
  text: {
    alignSelf: 'center',
    ...text
  }
});
