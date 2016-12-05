'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { getNotificationDays, verifyName } from './utils.js';

import SelectNotificationDays from './SelectNotificationDays.js';

import { CustomTextInput, CanDisableButton, Drawer, CustomTimePicker } from './blocks';

import { uiblocks, pages } from './globstyle';

let navigator;

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      notificationDays: 0,
      verifying: false
      notificationTime: '0:0',
    };
    navigator = this.props.navigator;
    this.givenUsername = '';

    this.onSelectNotificationDaysPressed = this.onSelectNotificationDaysPressed.bind(this);
    this.notificationDaysChanged = this.notificationDaysChanged.bind(this);
    this.goBack = this.goBack.bind(this);
    this.hourSelected = this.hourSelected.bind(this);

    getNotificationDays()
      .then((days) => this.setState({notificationDays: parseInt(days)}))
      .catch((error) => console.log('ERROR', error));
  }

  componentWillMount() {
    this.setState({
      username: this.props.username
    getNotificationTime().then((times) => {
      let days = null;
      let time = null;
      if (times.length > 0) {
        if (times[0][0] === NOTIFICATION_DAYS_KEY) {
          days = times[0][1];
          time = times[1][1];
        } else {
          time = times[0][1];
          days = times[1][1];
        }
      }
      let actualDays = 0;
      let actualTime = '0:0';
      if (parseInt(days)) {
        actualDays = parseInt(days);
      }
      if (time) {
        actualTime = time;
      }
      this.setState({
        notificationTime: actualTime,
        notificationDays: actualDays,
      });
    });
    this.givenUsername = this.props.username;
  }

  notificationDaysChanged(notificationDays) {
    this.setState({notificationDays});
  }

  hourSelected(newTime) {
    const [hour, minute] = newTime;
    const timeStr = hour + ':' + minute;
    this.setState({notificationTime: timeStr});
  }

  static getNext(callback, username) {
    return {
      component: Settings,
      title: 'Settings',
      rightButtonTitle: 'Save',
      onRightButtonPress: () => {
        // TODO: save the state
        navigator.pop();
      },
      passProps: {
        callback: callback,
        username: username,
      },
    };
  }

  goBack() {
    if (this.state.username === '') {
      return;
      verifyName(this.state.username.toLocaleLowerCase(), (found) => {
        if (found) {
          setUserInfo(this.state.username)
            .then(() => {
              this.props.callback(this.state.username);
            })
            .catch(error => {
              Alert.alert('Error', 'Unable to save username');
              console.log('ERROR', error);
            });
        } else {
          Alert.alert('Name not found', 'Unable to find name ' + this.state.username);
        }
      });
    }

    this.setState({ verifying: true });

  retrieveTime() {
    const timeParts = this.state.notificationTime.split(':');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    return [hour, minute];
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);
    const condition = this.state.username === this.givenUsername;
    const [hour, minute] = this.retrieveTime();

    const view = (
      <View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this.onSelectNotificationDaysPressed}>
            <Text style={styles.buttonText}>Notification days</Text>
          </TouchableOpacity>
          <CustomTimePicker
            hour={hour}
            minute={minute}
            onSelected={this.hourSelected}
          />
          <Text>Username</Text>
          <CustomTextInput
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
          />
          <CanDisableButton
            disabled={condition}
            opacityCondition={true}
            onPress={this.goBack}
            text={'Save'}
          />
        </View>
        {spinner}
      </View>
    );

    return Drawer.wrapView(view, 'Settings');
  }

  onSelectNotificationDaysPressed() {
    this.props.navigator.push(SelectNotificationDays.getNext({
      notificationDays: this.state.notificationDays,
      notificationDaysChanged: this.notificationDaysChanged
    }));
  }

}

Settings.propTypes = {
  navigator: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

const { settings } = pages;
const { textInput, button } = uiblocks;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    ...settings
  },
  usernameInput: {
    flex: 4,
    ...textInput
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginRight: 5,
    padding: 4,
    ...button.enabled
  },
  buttonText: {
    alignSelf: 'center',
    ...button.text
  }
});
