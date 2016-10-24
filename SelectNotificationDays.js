'use strict';

import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday'];

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
    return (
      <View style={styles.container}>
        {dayButtons}
      </View>
    );
  }

  dayPressed(idx) {
    selectedDays = this.state.selectedDays ^ Math.pow(2, idx);
    this.setState({ selectedDays });
    this.props.notificationDaysChanged(selectedDays);
  }

  static getNext(passProps) {
    return {
      title: 'Notification days',
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

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 60,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  checkMark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 10
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
    alignSelf: 'center',
    marginLeft: 10
  }
});
