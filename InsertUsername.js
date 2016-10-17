'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

import {
  getStorageItem,
  setStorageItem,
  verifyName,
  USERNAME_STORAGE_KEY
} from './utils.js';

import InsertLunch from './InsertLunch.js';

export default class InsertUsername extends Component {

  constructor(props) {
    super(props);

    this.state = {
      verifying: false,
      searchString: ''
    };

    this.onVerifyPressed = this.onVerifyPressed.bind(this);

    getStorageItem(USERNAME_STORAGE_KEY)
      .then(value => this.setState({ searchString: value || '' }))
      .catch(error => {
        Alert.alert('Error', 'Unable to access to local storage');
        console.log('ERROR', error);
      });
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Username</Text>
        <TextInput style={styles.usernameInput}
          value={this.state.searchString}
          underlayColor='#99d9f4'
          onChangeText={(searchString) => this.setState({ searchString })} />
        <TouchableOpacity style={this.state.verifying || this.state.searchString === '' ? styles.disabledButton : styles.button}
          activeOpacity={this.state.verifying ? 1 : 0.2}
          disabled={this.state.verifying || this.state.searchString === ''}
          onPress={this.onVerifyPressed}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        {spinner}
      </View>
    );
  }

  onVerifyPressed() {
    if (this.state.searchString === '') {
      return;
    }

    this.setState({ verifying: true });

    verifyName(this.state.searchString, (found) => {
      if (found) {
        setStorageItem(USERNAME_STORAGE_KEY, this.state.searchString)
          .then(() => this.props.navigator.replace({
            title: 'Insert lunch',
            component: InsertLunch
          }))
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
  usernameInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
    marginBottom: 20
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
