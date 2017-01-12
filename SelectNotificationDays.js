'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import { uiblocks, pages } from './globstyle';

import { Drawer } from './blocks';

import I18n from 'react-native-i18n';

const days = [
  I18n.t('mon'),
  I18n.t('tue'),
  I18n.t('wed'),
  I18n.t('thu'),
  I18n.t('fri'),
  I18n.t('sat'),
  I18n.t('sun'),
];

let selectedDays;

export default class SelectNotificationDays extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDays: this.props.notificationDays
    };
    this.dayPressed = this.dayPressed.bind(this);
  }

  render() {
    const dayButtons = this.createDayButtons();
    const view = (
      <View style={styles.container}>
        {dayButtons}
      </View>
    );

    return Drawer.wrapView(view, I18n.t('selectDays'), null, this.props.navigator);
  }

  dayPressed(idx) {
    selectedDays = this.state.selectedDays ^ Math.pow(2, idx);
    this.setState({ selectedDays });
    this.props.notificationDaysChanged(selectedDays);
  }

  static getNext(passProps) {
    return {
      title: I18n.t('notificationDays'),
      component: SelectNotificationDays,
      passProps: passProps
    };
  }

  createDayButtons() {
    return days.map((day, i) => {
      const checkmark = this.state.selectedDays & Math.pow(2, i) ? '✓' : '';
      return (
        <TouchableOpacity style={styles.button} key={i} onPress={() => this.dayPressed(i)}>
          <View style={styles.dayRow}>
            <Text style={styles.buttonText}>{day}</Text>
            <Text style={styles.checkMark}>{checkmark}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }
}

SelectNotificationDays.propTypes = {
  navigator: PropTypes.object.isRequired,
  notificationDaysChanged: PropTypes.func.isRequired,
  notificationDays: PropTypes.number.isRequired
};

const { selectNotificationDays } = pages;
const { enabled, checkMark, text } = uiblocks.button;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    ...selectNotificationDays
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  checkMark: {
    alignSelf: 'center',
    ...checkMark
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 10,
    ...enabled
  },
  buttonText: {
    alignSelf: 'center',
    marginLeft: 10,
    ...text
  }
});
