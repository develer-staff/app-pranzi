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
    const { verifyng, searchString } = this.state;
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

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 60,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  disabledButton: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#787F82',
    borderColor: '#787F82',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  activityIndicator: {
    marginTop: 20
  }
});
