import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

import InsertUsername from './InsertUsername.js';

export default class AppPranzi extends Component {
  render() {
    return (
      <NavigatorIOS style={styles.container}
        initialRoute={{component: InsertUsername, title: 'Pranzi'}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 22
  }
});

AppRegistry.registerComponent('AppPranzi', () => AppPranzi);
