'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
 setNotificationDays,
 setNotificationHour,
 getNotificationTime,
 setUserInfo,
 NOTIFICATION_DAYS_KEY,
 verifyName,
} from './utils.js';

import AlertSystem from './AlertSystem';

import SelectNotificationDays from './SelectNotificationDays.js';

import { CustomTextInput, CanDisableButton, Drawer, CustomTimePicker } from './blocks';

import { uiblocks, pages } from './globstyle';

import NotificationManager from './NotificationManager';

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
      const parsedDays = parseInt(days);
      if (parsedDays) {
        actualDays = parsedDays;
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
    const { username, notificationDays, notificationTime, saved } = this.state;

    if (username !== saved.username) {
      this.setState({ verifying: true });

      verifyName(username.toLocaleLowerCase(), (found) => {
        if (found) {
          setUserInfo(username)
            .then(() => {
              this.props.callback(username);
              saved.username = username;
              this.setState(this.state);
            })
            .catch(error => {
              AlertSystem.alert('Error', 'Unable to save username');
              console.log('ERROR', error);
            });
        } else {
          AlertSystem.alert('Name not found', 'Unable to find name ' + username);
        }
        this.setState({ verifying: false });
      });
    }

    let datesChanged = false;

    if (notificationDays !== saved.notificationDays) {
      datesChanged = true;
      setNotificationDays('' + notificationDays).then(() => {
        saved.notificationDays = notificationDays;
        this.setState(this.state);
      });
    }

    if (notificationTime !== saved.notificationTime) {
      datesChanged = true;
      setNotificationHour(notificationTime).then(() => {
        saved.notificationTime = notificationTime;
        this.setState(this.state);
      });
    }

    if (datesChanged) {
      const today = new Date();

      const days = [];

      for (let i = 0; i < 7; i++) {
        const day = (this.state.notificationDays & Math.pow(2, i)) !== 0;
        days.push(day);
      }

      const dates = [];
      const [hoursStr, minutesStr] = this.state.notificationTime.split(':');
      const hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);

      let dow = today.getDay();
      let checked = 0;
      let guard = 7;
      // add one day if notification time is in the past
      if (today.getHours() >= hours) {
        dow = (dow + 1) % 7;
        checked++;
        guard++;
      }

      while (checked < guard) {
        if (days[dow]) {
          const schedule = new Date();
          schedule.setHours(hours, minutes, 0);
          schedule.setDate(schedule.getDate() + checked);

          dates.push(schedule);
        }
        dow = (dow + 1) % 7;
        checked++;
      }

      NotificationManager.resetNotifications(dates);
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

    if ((this.state.username !== this.state.saved.username) ||
        (this.state.notificationDays !== this.state.saved.notificationDays) ||
        (this.state.notificationTime !== this.state.saved.notificationTime)) {
      return true;
    }

    return false;
  }

  buildNotificationDaysButton() {
    const dayNames = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
    };
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = (this.state.notificationDays & Math.pow(2, i)) !== 0;
      if (day) {
        days.push(dayNames[i]);
      }
    }

    let text = 'No notification day(s) set';
    if (days.length > 0) {
      text = days.join(', ');
    }

    return (
      <TouchableOpacity style={styles.button} onPress={this.onSelectNotificationDaysPressed}>
        <Text style={styles.buttonText}>{ text }</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : null;
    const condition = !this.stateIsDirty();

    const [hour, minute] = this.retrieveTime();

    const view = (
      <View>
        <View style={styles.container}>
          { this.buildNotificationDaysButton() }
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

    return Drawer.wrapView(view, 'Settings', null, this.props.navigator);
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
