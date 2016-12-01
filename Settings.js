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

import { CustomTextInput, CanDisableButton, Drawer } from './blocks';

import { uiblocks, pages } from './globstyle';

let navigator;

export default class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      notificationDays: 0,
      verifying: false
    };
    navigator = this.props.navigator;
    this.givenUsername = '';

    this.onSelectNotificationDaysPressed = this.onSelectNotificationDaysPressed.bind(this);
    this.notificationDaysChanged = this.notificationDaysChanged.bind(this);
    this.goBack = this.goBack.bind(this);

    getNotificationDays()
      .then((days) => this.setState({notificationDays: parseInt(days)}))
      .catch((error) => console.log('ERROR', error));
  }

  componentWillMount() {
    this.setState({
      username: this.props.username
    });
    this.givenUsername = this.props.username;
  }

  notificationDaysChanged(notificationDays) {
    this.setState({notificationDays});
  }

  static getNext(callback, cls, username) {
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
        cls: cls,
      },
    };
  }

  goBack() {
    if (this.state.username === '') {
      return;
    }

    this.setState({ verifying: true });

    verifyName(this.state.username.toLocaleLowerCase(), (found) => {
      if (found) {
        this.props.callback(this.state.username, this.props.cls);
        this.givenUsername = this.state.username;
      } else {
        Alert.alert('Name not found', 'Unable to find name ' + this.state.username);
      }
      this.setState({ verifying: false });
    });
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);
    const condition = this.state.username === this.givenUsername;

    const view = (
      <View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this.onSelectNotificationDaysPressed}>
            <Text style={styles.buttonText}>Notification days</Text>
          </TouchableOpacity>
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
  cls: PropTypes.object,
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
