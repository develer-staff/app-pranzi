'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DismissKeyboard from 'dismissKeyboard';

import {
  setStorageItem,
  verifyName,
  USERNAME_STORAGE_KEY
} from './utils.js';

import AlertSystem from './AlertSystem';

import InsertLunch from './InsertLunch';
import { CustomTextInput, CanDisableButton } from './blocks';

import { uiblocks, pages } from './globstyle';

import I18n from 'react-native-i18n';

export default class InsertUsername extends Component {

  constructor(props) {
    super(props);

    this.state = {
      verifying: false,
      searchString: ''
    };

    this.onVerifyPressed = this.onVerifyPressed.bind(this);
  }

  static getNext() {
    return {
      component: InsertUsername,
      title: I18n.t('insertUsername')
    };
  }

  render() {
    const { verifying, searchString } = this.state;
    const spinner = verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);

    const disabled = verifying || searchString === '';

    return (
      <View style={styles.container}>
        <Text style={styles.description}>{ I18n.t('username') }</Text>
        <CustomTextInput
          value={ searchString }
          onChangeText={(searchString) => this.setState({ searchString })}
        />
        <CanDisableButton
          disabled={ disabled }
          opacityCondition={ verifying }
          onPress={ this.onVerifyPressed }
          text={ I18n.t('verify') }
        />
        {spinner}
      </View>
    );
  }

  onVerifyPressed() {
    if (this.state.searchString === '') {
      return;
    }

    this.setState({ verifying: true });

    verifyName(this.state.searchString.toLocaleLowerCase(), (found) => {
      if (found) {
        setStorageItem(USERNAME_STORAGE_KEY, this.state.searchString)
          .then(() => {
            this.props.navigator.replace(InsertLunch.getNext());
            DismissKeyboard();
          })
          .catch(error => {
            AlertSystem.alert(I18n.t('error'), I18n.t('unableSave'));
            console.log('ERROR', error);
          });
      } else {
        AlertSystem.alert(I18n.t('nameNotFound'), I18n.t('unableFind') + this.state.searchString);
      }
      this.setState({ verifying: false });
    });
  }
}

InsertUsername.propTypes = {
  navigator: PropTypes.object.isRequired
};

const { text, activityIndicator } = uiblocks;
const { insertUsername } = pages;

const styles = StyleSheet.create({
  description: {
    textAlign: 'center',
    ...text
  },
  container: {
    ...insertUsername
  },
  activityIndicator: {
    ...activityIndicator
  }
});
