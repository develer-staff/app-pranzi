import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Settings from './Settings.js';

import AlertSystem from './AlertSystem';

import { getUserInfo, addLunch } from './utils.js';

import { uiblocks, pages } from './globstyle';

import { ToggleButton, CustomDatePicker, Drawer } from './blocks';

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
    this.goToSettings = this.goToSettings.bind(this);
    this.usernameModified = this.usernameModified.bind(this);
    this.sendNothing = this.sendNothing.bind(this);
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
    if (this.state.selectedCourses === 0) {
      AlertSystem.alert('Warning', 'You have to select what you ate!');
      return;
    }

    this.setState({ loading: true });
    let lunch = null;

    lunch = COURSES.map((course) => {
      return this.state.selectedCourses & course.value ? course.strToSend : '';
    }).join('');

    addLunch(this.state.selectedUsername.toLocaleLowerCase(), this.state.date, lunch, (result) => {
      this.setState({ loading: false, selectedCourses: 0 });
      AlertSystem.alert('Set result', result ? 'Lunch set correctly' : 'Unable to set lunch');
    });
  }

  sendNothing() {
    this.setState({ loading: true, selectedCourses: 0 });
    const lunch = 'Niente';

    addLunch(this.state.selectedUsername.toLocaleLowerCase(), this.state.date, lunch, (result) => {
      this.setState({ loading: false });
      AlertSystem.alert('Set result', result ? 'Lunch set correctly' : 'Unable to set lunch');
    });
  }

  onSelectDatePressed(date) {
    this.setState({ date: date });
  }

  toggleCourseSelection(course) {
    this.setState({ selectedCourses: this.state.selectedCourses ^ course });
  }

  createCourseButtons() {
    return COURSES.map((course, i) => {
      const courseSelected = this.state.selectedCourses & course.value;
      return (
        <ToggleButton
          onPress={() => this.toggleCourseSelection(course.value)}
          key={i}
          text={course.str}
          isPressed={courseSelected}
        />
      );
    });
  }

  usernameModified(newUsername) {
    this.setState({selectedUsername: newUsername});
  }

  goToSettings() {
    navigator.push(Settings.getNext(this.usernameModified, this.state.selectedUsername));
  }

  renderDatePicker() {
    return (
      <View>
        <Text style={styles.description}>Select the day</Text>
        <CustomDatePicker
          navigator={this.props.navigator}
          onSelected={this.onSelectDatePressed}
          date={this.state.date}
          maxDate={new Date()}
        />
      </View>
    );
  }

  render() {
    const courseButtons = this.createCourseButtons();

    let selectedUsername = null;

    if (this.state.selectedUsername !== '') {
      selectedUsername = (<Text style={styles.description}>Selected username: {this.state.selectedUsername}</Text>);
    }

    const spinner = this.state.loading ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);

    const completeView = (
      <View>
        <View style={styles.container}>
          {this.renderDatePicker()}
          <Text style={styles.description}>What did you eat?</Text>
          <View style={styles.courseButtonsContainer}>
            {courseButtons}
          </View>
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.button} onPress={this.sendNothing}>
              <Text style={styles.buttonText}>Nothing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.onSendPressed}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          {selectedUsername}
          {spinner}
        </View>
      </View>
    );

    return Drawer.wrapView(completeView, 'Lunch', this.goToSettings);
  }

}

InsertLunch.propTypes = {
  navigator: PropTypes.object.isRequired
};

const { text, button } = uiblocks;
const { insertLunch } = pages;

const styles = StyleSheet.create({
  description: {
    textAlign: 'center',
    ...text
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    ...insertLunch
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 10,
    ...button.enabled
  },
  buttonText: {
    alignSelf: 'center',
    ...button.text
  },
  courseButtonsContainer: {
    flexDirection: 'row',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
