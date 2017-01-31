import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  ActivityIndicator,
  View,
  Text,
  AlertIOS,
} from 'react-native';

import PushNotification from 'react-native-push-notification';

import Settings from './Settings.js';

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


  componentDidMount() {
    PushNotification.configure({
      onNotification: (notification) => {
        AlertIOS.alert('App Pranzi', notification.message);
      },
      permissions: { alert: true, badge: true, sound: true },
      requestPermissions: true,
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

    const initial = this.state.usernameAvailable ? InsertLunch.getNext() : Settings.getNext();

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={initial}
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
