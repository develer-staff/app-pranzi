import React, { Component, PropTypes } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';

import Settings from './Settings.js';

import { getUserInfo, addLunch, setUserInfo } from './utils.js';

import { uiblocks, pages, images } from './globstyle';

import { ToggleButton, CustomDatePicker, CustomNavBar } from './blocks';

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

  onSelectDatePressed(date) {
    this.setState({ date: date });
    // console.log(this.state.date);
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

  usernameModified(newUsername, cls) {
    setUserInfo(newUsername)
      .then(() => {
        cls.setState({selectedUsername: newUsername});
      })
      .catch(error => {
        Alert.alert('Error', 'Unable to save username');
        console.log('ERROR', error);
      });
  }

  goToSettings() {
    navigator.push(Settings.getNext(this.usernameModified, this, this.state.selectedUsername));
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

    const nav = Platform.OS === 'android' ? (<CustomNavBar text={'Lunch'} action={this.goToSettings} actionIcon={images.settings.icon}/>) : (<View />);
    const datePicker = this.renderDatePicker();

    return (
      <View>
        {nav}
        <View style={styles.container}>
          {datePicker}
          <Text style={styles.description}>What did you eat?</Text>
          <View style={styles.courseButtonsContainer}>
            {courseButtons}
          </View>
          <View style={styles.bottomButtonsContainer}>
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
      </View>
    );
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
