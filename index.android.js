/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  ActivityIndicator,
  Text,
  View,
  BackAndroid
} from 'react-native';

import InsertUsername from './InsertUsername.js';

import InsertLunch from './InsertLunch';

import { getStorageItem, USERNAME_STORAGE_KEY } from './utils.js';

export default class AppPranzi extends Component {
  constructor(props) {
    super(props);
    this.navigator = null;
    this.state = {
      retrievingUsername: true,
      usernameAvailable: false
    };
    this._renderScene.bind(this);
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
        this.navigator.pop();
        return true;
      }
    });
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

  _renderScene(route, navigator) {
    return (<route.component navigator={navigator} {...route.passProps} />);
  }

  render() {
    if (this.state.retrievingUsername) {
      return (
        <View style={styles.loadViewStyle}>
          <Text style={styles.description}>Loading</Text>
          <ActivityIndicator size='large' />
        </View>);
    }

    const initial = this.state.usernameAvailable ? InsertLunch.getNext() : InsertUsername.getNext();

    return (
      <Navigator
        initialRoute={ initial }
        renderScene={ this._renderScene }
        ref={ (nav) => { this.navigator = nav } }
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
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('AppPranzi', () => AppPranzi);

