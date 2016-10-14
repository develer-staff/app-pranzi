'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  AsyncStorage
} from 'react-native';

const SPREADSHEET_ID = '1Ox0nwWTKa_PgM7O6ZfMrbRyOcscjCkOdUKn0QNV91Rk';
const APP_KEY = 'AIzaSyDR1nYnRjKy1DzsE83pfllMJxPEcJ-bI9Q';
const SPREADSHEET_GOOGLE_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const VALUES_BATCH_GET = 'values:batchGet';
const STORAGE_KEY = '@Username:key';

function columnToLetter(column) {
  let temp;
  let letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function composeQueryParameters(data) {
  // Add App Key to query
  data['key'] = APP_KEY;
  return '?' + Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
}

export default class InsertUsername extends Component {

  constructor(props) {
    super(props);

    this.state = {
      verifying: false,
      searchString: ''
    };

    this.onVerifyPressed = this.onVerifyPressed.bind(this);

    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      let searchString = '';
      value = value || '';
      if (value !== null) {
        searchString = value;
        console.log('constructor', searchString);
      }
      this.setState({ searchString: value });
    }).done();
  }

  render() {
    const spinner = this.state.verifying ? (<ActivityIndicator size='large' style={styles.activityIndicator} />) : (<View />);
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Username</Text>
        <TextInput style={styles.usernameInput}
          value={this.state.searchString}
          underlayColor='#99d9f4'
          onChangeText={(searchString) => this.setState({ searchString })} />
        <TouchableOpacity style={this.state.verifying || this.state.searchString === '' ? styles.disabledButton : styles.button}
          activeOpacity={this.state.verifying ? 1 : 0.2}
          disabled={this.state.verifying || this.state.searchString === ''}
          onPress={this.onVerifyPressed}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        {spinner}
      </View>
    );
  }

  onVerifyPressed() {
    if (this.state.searchString === '') {
      return;
    }

    this.setState({
      verifying: true,
      searchString: this.state.searchString.toLowerCase()
    });
    this._verifyName();
  }

  _verifyName() {
    this.requestForSheetMetadata();
  }

  requestForSheetMetadata() {
    var query = [SPREADSHEET_GOOGLE_API_URL, SPREADSHEET_ID, composeQueryParameters({ 'includeGridData': 'false' })].join('/');
    fetch(query)
      .then(response => response.json())
      .then(json => this.requestForNames(this._handleSheetMetadataResponse(json)))
      .then(response => response.json())
      .then(json => this._handleRequestForNamesResponse(json))
      .catch(error => console.log('ERROR', error));
  }

  _handleSheetMetadataResponse(response) {
    const gridProperties = response['sheets'][0]['properties']['gridProperties'];
    return gridProperties['columnCount'];
  }

  requestForNames(columnCount) {
    var query = [SPREADSHEET_GOOGLE_API_URL, SPREADSHEET_ID, VALUES_BATCH_GET, composeQueryParameters({ 'ranges': 'B1:' + columnToLetter(columnCount) + '1' })].join('/');
    return fetch(query);
  }

  _handleRequestForNamesResponse(response) {
    const names = response['valueRanges'][0]['values'][0];
    var nameFound = false;
    for (var i = 0; i < names.length; i++) {
      if (names[i].toLowerCase() === this.state.searchString) {
        Alert.alert('Name found', 'Name found in position ' + i.toString());
        nameFound = true;
        try {
          AsyncStorage.setItem(STORAGE_KEY, names[i].toLowerCase());
          var a = AsyncStorage.getItem(STORAGE_KEY);
          console.log('ho appena salvato la chiave', a);
        } catch (error) {
          Alert.alert('Save problem', 'Unable to save username');
        }
        break;
      }
    }
    if (!nameFound) {
      Alert.alert('Name not found', 'Unable to find name ' + this.state.searchString);
    }
    this.setState({ verifying: false });
  }
}

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 60,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  usernameInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
    marginBottom: 20
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
  disabledButton: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#787F82',
    borderColor: '#787F82',
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
  activityIndicator: {
    marginTop: 20
  }
});
