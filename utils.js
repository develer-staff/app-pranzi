'use strict';

import {
  AsyncStorage
} from 'react-native';

export const USERNAME_STORAGE_KEY = '@Username:key';

const SPREADSHEET_ID = '1Ox0nwWTKa_PgM7O6ZfMrbRyOcscjCkOdUKn0QNV91Rk';
const APP_KEY = 'AIzaSyDR1nYnRjKy1DzsE83pfllMJxPEcJ-bI9Q';
const SPREADSHEET_GOOGLE_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const VALUES_BATCH_GET = 'values:batchGet';

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

export function checkSavedUsername(func) {
  getStorageItem(USERNAME_STORAGE_KEY)
  .then(value => verifyName(value, func))
  .catch(error => console.log('ERROR', error));
}

export function composeQueryParameters(data) {
  // Add App Key to query
  data['key'] = APP_KEY;
  return '?' + Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
}

export function getStorageItem(key) {
  return AsyncStorage.getItem(key);
}

export function setStorageItem(key, value) {
  return AsyncStorage.setItem(key, value);
}

export function verifyName(searchedName, func) {
  requestForSheetMetadata(searchedName.toLowerCase(), func);
}

function requestForSheetMetadata(searchedName, func) {
  const query = [SPREADSHEET_GOOGLE_API_URL, SPREADSHEET_ID, composeQueryParameters({ 'includeGridData': 'false' })].join('/');
  fetch(query)
    .then(response => response.json())
    .then(json => requestForNames(handleSheetMetadataResponse(json)))
    .then(response => response.json())
    .then(json => handleRequestForNamesResponse(json, searchedName, func))
    .catch(error => console.log('ERROR', error));
}

function handleSheetMetadataResponse(response) {
  const gridProperties = response['sheets'][0]['properties']['gridProperties'];
  return gridProperties['columnCount'];
}

function requestForNames(columnCount) {
  const query = [SPREADSHEET_GOOGLE_API_URL, SPREADSHEET_ID, VALUES_BATCH_GET, composeQueryParameters({ 'ranges': 'B1:' + columnToLetter(columnCount) + '1' })].join('/');
  return fetch(query);
}

function handleRequestForNamesResponse(response, searchedName, func) {
  const names = response['valueRanges'][0]['values'][0];
  for (let i = 0; i < names.length; i++) {
    if (names[i].toLowerCase() === searchedName) {
      func(true);
      return;
    }
  }
  func(false);
  return;
}
