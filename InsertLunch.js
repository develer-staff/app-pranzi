import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import SelectDate from './SelectDate.js';

const FIRST = 1;
const SECOND = 2;
const DESSERT = 4;

export default class InsertLunch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      tempDate: new Date(),
      selectedCourses: 0
    };
    this.onSelectDatePressed = this.onSelectDatePressed.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({ tempDate: date });
  }

  onSelectDatePressed() {
    this.props.navigator.push({
      title: 'Select date',
      component: SelectDate,
      passProps: {
        date: this.state.date,
        onDateChange: this.onDateChange
      },
      rightButtonTitle: 'Save',
      onRightButtonPress: () => {
        this.setState({ date: this.state.tempDate });
        this.props.navigator.pop();
      },
      onLeftButtonPress: () => {
        this.setState({ tempDate: this.state.date });
      }
    });
  }

  toggleCourseSelection(course) {
    this.setState({ selectedCourses: this.state.selectedCourses ^ course });
  }

  createCourseButtons() {
    const courses = [{ str: 'F', value: FIRST }, { str: 'S', value: SECOND }, { str: 'D', value: DESSERT }];
    return courses.map((course, i) => {
      const courseSelected = this.state.selectedCourses & course.value;
      return (
        <TouchableOpacity
          style={[styles.button, courseSelected && styles.buttonPressed]}
          onPress={() => this.toggleCourseSelection(course.value)}
          key={i}
          >
          <Text style={[styles.buttonText, courseSelected && styles.buttonPressedText]}>{course.str}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    const dateString = this.state.date.toDateString() === new Date().toDateString() ? 'Today' : this.state.date.toLocaleDateString('it-IT');

    const courseButtons = this.createCourseButtons();

    return (
      <View style={styles.container}>
        <Text style={styles.description}>Select the day</Text>
        <TouchableOpacity style={styles.button} onPress={this.onSelectDatePressed}>
          <Text style={styles.buttonText}>{dateString}</Text>
        </TouchableOpacity>
        <Text style={styles.description}>What did you eat?</Text>
        <View style={{ flexDirection: 'row' }}>
          {courseButtons}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Nothing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onValueChange(key, value) {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  };
}

InsertLunch.propTypes = {
  navigator: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 60,
    flexDirection: 'column',
    justifyContent: 'space-around'
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
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  buttonPressed: {
    backgroundColor: '#225C75',
    borderColor: '#225C75'
  },
  buttonPressedText: {
    color: 'white'
  }
});
