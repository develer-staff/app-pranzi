import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import SelectDate from './SelectDate.js';

import Settings from './Settings.js';

import { getUserInfo, addLunch } from './utils.js';

const FIRST = 1;
const SECOND = 2;
const DESSERT = 4;

const COURSES = [{ str: 'F', value: FIRST, strToSend: 'P' },
{ str: 'S', value: SECOND, strToSend: 'S' }, { str: 'D', value: DESSERT, strToSend: 'D' }];

let navigator;

export default class InsertLunch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      tempDate: new Date(),
      selectedCourses: 0,
      selectedUsername: '',
      loading: false
    };
    navigator = this.props.navigator;
    this.onSelectDatePressed = this.onSelectDatePressed.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
    this.onSendPressed = this.onSendPressed.bind(this);
  }

  onDateChanged(date) {
    this.setState({ tempDate: date });
  }

  componentWillMount() {
    getUserInfo()
      .then((values) => {
        console.log('values', values);
        this.setState({
          selectedUsername: values
        });
      })
      .catch(() => {
        this.setState({ selectedUsername: '' });
      });
  }

  static getNext() {
    return {
      component: InsertLunch,
      title: 'Lunch',
      rightButtonTitle: 'Settings',
      onRightButtonPress: () => {
        navigator.push(Settings.getNext());
      },
      // Because https://github.com/facebook/react-native/issues/476 is impossible to use replace in NavigatorIOS,
      // to switch from InsertUsername to InsertLunch: to avoid this problem InsertUsername push InsertLunch.
      // I need to set `leftButtonTitle` to space to prevent user to go back to InsertUsername from InsertLunch.
      leftButtonTitle: ' '
    };
  }

  onSendPressed() {
    this.setState({ loading: true });
    addLunch(this.state.selectedUsername.toLocaleLowerCase(), this.state.date, COURSES.map((course) => {
      return this.state.selectedCourses & course.value ? course.strToSend : '';
    }).join(''), (result) => {
      this.setState({ loading: false });
      Alert.alert('Set result', result ? 'Lunch set correctly' : 'Unable to set lunch');
    });
  }

  onSelectDatePressed() {
    this.props.navigator.push({
      title: 'Select date',
      component: SelectDate,
      passProps: {
        date: this.state.date,
        onDateChanged: this.onDateChanged
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
    return COURSES.map((course, i) => {
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

    const selectedUsername = this.state.selectedUsername !== '' ? (<Text style={styles.description}>Selected username: {this.state.selectedUsername}</Text>) : null;

    const spinner = this.state.loading ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Nothing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.onSendPressed}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
        {selectedUsername}
        {spinner}
      </View>
    );
  }

}

InsertLunch.propTypes = {
  navigator: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    marginTop: 20,
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
    justifyContent: 'center',
    margin: 10
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
