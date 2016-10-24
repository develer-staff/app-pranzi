'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { getUserInfo, getNotificationDays } from './utils.js';

import SelectNotificationDays from './SelectNotificationDays.js';

let navigator;

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      notificationDays: 0
    };
    navigator = this.props.navigator;

    this.onSelectNotificationDaysPressed = this.onSelectNotificationDaysPressed.bind(this);
    this.notificationDaysChanged = this.notificationDaysChanged.bind(this);

    getNotificationDays()
      .then((days) => this.setState({notificationDays: parseInt(days)}))
      .catch((error) => console.log('ERROR', error));
  }

  componentWillMount() {
    getUserInfo()
      .then((values) => {
        console.log('values', values);
        this.setState({
          username: values
        });
      })
      .catch((error) => {
        console.log('ERROR', error);
        this.setState({ username: '' });
      });
  }

  notificationDaysChanged(notificationDays) {
    this.setState({notificationDays});
  }

  static getNext() {
    return {
      component: Settings,
      title: 'Settings',
      rightButtonTitle: 'Save',
      onRightButtonPress: () => {
        // TODO: save the state
        navigator.pop();
      }
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.onSelectNotificationDaysPressed}>
          <Text style={styles.buttonText}>Notification days</Text>
        </TouchableOpacity>
        <Text>Username</Text>
        <TextInput
          style={styles.usernameInput}
          underlayColor='#99d9f4'
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })} />
      </View>
    );
  }

  onSelectNotificationDaysPressed() {
    this.props.navigator.push(SelectNotificationDays.getNext({
      notificationDays: this.state.notificationDays,
      notificationDaysChanged: this.notificationDaysChanged
    }));
  }

}

Settings.propTypes = {
  navigator: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    margin: 10
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  }
});
