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
    const { condition, altCondition, onPress, text } = this.props;
    const style = condition ? [defaultStyle.enabled, defaultStyle.disabled] : defaultStyle.enabled;

    return (
      <TouchableOpacity style={ style }
        activeOpacity={ altCondition ? 1 : 0.2 }
        disabled={ condition }
        onPress={ onPress }>
        <Text style={defaultStyle.text}>{ text }</Text>
      </TouchableOpacity>
    );
  }
}

CanDisableButton.propTypes = {
  condition: PropTypes.bool.isRequired,
  altCondition: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
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
