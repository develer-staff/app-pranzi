'use strict';

import {
  AsyncStorage
} from 'react-native';

export const USERNAME_STORAGE_KEY = '@Username:key';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwDUz7rnEwase-2vvKOANn_zb9g6yr05ajPn3LQ-EFWbi2rB0/exec?';
const SEARCH_USERNAME_FUNC = 'search';
const INSERT_LUNCH_FUNC = 'insert';

export function verifyName(searchedName, func) {
  const query = SCRIPT_URL + composeQueryParameters({
    'user': searchedName,
    'func': SEARCH_USERNAME_FUNC
  });
  fetch(query)
    .then(response => response.json())
    .then(json => {
      if (json.error !== 0) {
        console.log('ERROR', json.message);
      }
      func(json.error === 0);
    })
    .catch(error => console.log('ERROR', error));
}

export function addLunch(name, date, lunch, func) {
  const d = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
  const query = SCRIPT_URL + composeQueryParameters({
    'func': INSERT_LUNCH_FUNC,
    'user': name,
    'date': d,
    'food': lunch
  });
  console.log('query', query);
  fetch(query)
    .then(response => response.json())
    .then(json => {
      if (json.error !== 0) {
        console.log('ERROR', json.message);
      }
      func(json.error === 0);
    })
    .catch(error => console.log('ERROR', error));
}

export function getUserInfo() {
  return getStorageItem(USERNAME_STORAGE_KEY);
}

export function checkSavedUsername(func) {
  getStorageItem(USERNAME_STORAGE_KEY)
    .then(value => verifyName(value, func))
    .catch(error => console.log('ERROR', error));
}

function composeQueryParameters(data) {
  return Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
}

export function getStorageItem(key) {
  return AsyncStorage.getItem(key);
}

export function getStorageItems(keys) {
  return AsyncStorage.multiGet(keys);
}

export function setStorageItems(values) {
  return AsyncStorage.multiSet(values);
}

export function setStorageItem(key, value) {
  return AsyncStorage.setItem(key, value);
}
