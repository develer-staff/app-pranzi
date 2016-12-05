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

import {
 setNotificationDays,
 setNotificationHour,
 getNotificationTime,
 setUserInfo,
 NOTIFICATION_DAYS_KEY,
 verifyName,
} from './utils.js';

import SelectNotificationDays from './SelectNotificationDays.js';

import { CustomTextInput, CanDisableButton, Drawer, CustomTimePicker } from './blocks';

import { uiblocks, pages } from './globstyle';

let navigator;

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      notificationDays: 0,
      notificationTime: '0:0',
      verifying: false,
      saved: {
        username: this.props.username,
        notificationDays: 0,
        notificationTime: '0:0',
      },
    };
    this.loading = true;
    navigator = this.props.navigator;

    this.onSelectNotificationDaysPressed = this.onSelectNotificationDaysPressed.bind(this);
    this.notificationDaysChanged = this.notificationDaysChanged.bind(this);
    this.goBack = this.goBack.bind(this);
    this.hourSelected = this.hourSelected.bind(this);

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
      this.state.saved.notificationTime = actualTime;
      this.state.saved.notificationDays = actualDays;
      this.setState({
        notificationTime: actualTime,
        notificationDays: actualDays,
      });
      this.loading = false;
    });
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
    if (this.state.username !== this.state.saved.username) {
      this.setState({ verifying: true });

      verifyName(this.state.username.toLocaleLowerCase(), (found) => {
        if (found) {
          setUserInfo(this.state.username)
            .then(() => {
              this.props.callback(this.state.username);
              this.state.saved.username = this.state.username;
              this.setState(this.state);
            })
            .catch(error => {
              Alert.alert('Error', 'Unable to save username');
              console.log('ERROR', error);
            });
        } else {
          Alert.alert('Name not found', 'Unable to find name ' + this.state.username);
        }
        this.setState({ verifying: false });
      });
    }

    let datesChanged = false;

    if (this.state.notificationDays !== this.state.saved.notificationDays) {
      datesChanged = true;
      setNotificationDays('' + this.state.notificationDays).then(() => {
        this.state.saved.notificationDays = this.state.notificationDays;
        this.setState(this.state);
      });
    }

    if (this.state.notificationTime !== this.state.saved.notificationTime) {
      datesChanged = true;
      setNotificationHour(this.state.notificationTime).then(() => {
        this.state.saved.notificationTime = this.state.notificationTime;
        this.setState(this.state);
      });
    }

  }

  retrieveTime() {
    const timeParts = this.state.notificationTime.split(':');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    return [hour, minute];
  }

  stateIsDirty() {
    if (this.loading) {
      return false;
    }

    console.log(JSON.stringify(this.state));

    if (this.state.username !== this.state.saved.username) {
      return true;
    }

    if (this.state.notificationDays !== this.state.saved.notificationDays) {
      return true;
    }

    if (this.state.notificationTime !== this.state.saved.notificationTime) {
      return true;
    }

    return false;
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);
    const condition = !this.stateIsDirty();

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
