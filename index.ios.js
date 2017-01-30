import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  ActivityIndicator,
  View,
  Text
} from 'react-native';

import InsertUsername from './InsertUsername.js';

import InsertLunch from './InsertLunch';

import { getStorageItem, USERNAME_STORAGE_KEY } from './utils.js';

export default class AppPranzi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retrievingUsername: true,
      usernameAvailable: false
    };
  }

  componentWillMount() {
    getStorageItem(USERNAME_STORAGE_KEY)
      .then((username) => {
        this.setState({
          retrievingUsername: false,
          usernameAvailable: username !== null
        });
      })
      .catch(() => {
        this.setState({
          retrievingUsername: false,
          usernameAvailable: false
        });
      });
  }

  render() {
    if (this.state.retrievingUsername) {
      return (
        <View style={styles.loadViewStyle}>
          <Text style={styles.description}>Loading</Text>
          <ActivityIndicator size='large' />
        </View>);
    }

    return (
      <NavigatorIOS style={styles.container}
        initialRoute={this.state.usernameAvailable ? InsertLunch.getNext() : InsertUsername.getNext()}
        />
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    flex: 1,
    marginTop: 22
  },
  loadViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

AppRegistry.registerComponent('AppPranzi', () => AppPranzi);
