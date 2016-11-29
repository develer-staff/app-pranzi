'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

import {
  setStorageItem,
  verifyName,
  USERNAME_STORAGE_KEY
} from './utils.js';

import InsertLunch from './InsertLunch';
import { CustomTextInput, CanDisableButton } from './blocks';

import { uiblocks, pages } from './globstyle';
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
      title: 'Insert username'
    };
  }

  render() {
    const { verifying, searchString } = this.state;
    const spinner = verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);

    const disabled = verifying || searchString === '';

    return (
      <View style={styles.container}>
        <Text style={styles.description}>Username</Text>
        <CustomTextInput
          value={ searchString }
          onChangeText={(searchString) => this.setState({ searchString })}
        />
        <CanDisableButton
          disabled={ disabled }
          opacityCondition={ verifying }
          onPress={ this.onVerifyPressed }
          text={"Verify"}
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
            this.props.navigator.push(InsertLunch.getNext());
          })
          .catch(error => {
            Alert.alert('Error', 'Unable to save username');
            console.log('ERROR', error);
          });
      } else {
        Alert.alert('Name not found', 'Unable to find name ' + this.state.searchString);
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
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    ...insertUsername
  },
  activityIndicator: {
    ...activityIndicator
  }
});
