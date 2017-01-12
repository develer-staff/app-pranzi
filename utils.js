'use strict';

import {
  AsyncStorage
} from 'react-native';

import I18n from 'react-native-i18n';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

I18n.translations = {
  en: {
    username: 'Username',
    settings: 'Settings',
    firstCourse: 'F',
    secondCourse: 'S',
    dessert: 'D',
    nothing: 'Nothing',
    lunch: 'Lunch',
    warning: 'Warning',
    setResult: 'Set result',
    lunchSet: 'Lunch set correctly',
    lunchNotSet: 'Unable to set lunch',
    whatYouAte: 'What did you eat',
    save: 'Save',
    send: 'Send',
    verify: 'Verify',
    error: 'Error',
    selectedUsername: 'Selected username',
    selectDate: 'Select date',
    insertUsername: 'Insert username',
    unableSave: 'Unable to save username',
    nameNotFound: 'Name not found',
    unableFind: 'Unable to find name ',
    noSelected: 'You have to select what you ate!',
    notificationText: 'Remember to register what you ate!',
    selectDay: 'Select the day',
    selectDays: 'Select days',
    notificationDays: 'Notification days',
    noDays: 'No notification day(s) set',
    today: 'Today',
    sun: 'Sunday',
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sunShort: 'Sun',
    monShort: 'Mon',
    tueShort: 'Tue',
    wedShort: 'Wed',
    thuShort: 'Thu',
    friShort: 'Fri',
    satShort: 'Sat',
  },
  it: {
    username: 'Username',
    settings: 'Opzioni',
    firstCourse: 'P',
    secondCourse: 'S',
    dessert: 'D',
    nothing: 'Niente',
    lunch: 'Pranzo',
    warning: 'Attenzione',
    setResult: 'Risultato del salvataggio',
    lunchSet: 'Pranzo salvato correttamente',
    lunchNotSet: 'Impossibile salvare il pranzo',
    whatYouAte: 'Cosa hai mangiato',
    save: 'Salva',
    send: 'Invia',
    verify: 'Verifica',
    error: 'Errore',
    selectedUsername: 'Username selezionato',
    selectDate: 'Segli il giorno',
    insertUsername: 'Inserisci l\'username',
    unableSave: 'Impossibile salvare l\' username',
    nameNotFound: 'Nome non trovato',
    unableFind: 'Impossibile trovare l\'username ',
    noSelected: 'Scegli cosa hai mangiato!',
    notificationText: 'Ricordati di segnare cosa hai mangiato!',
    selectDay: 'Scegli il giorno',
    selectDays: 'Scegli i giorni',
    notificationDays: 'Giorni di notifica',
    noDays: 'Nessun giorno impostato',
    today: 'Oggi',
    sun: 'Domenica',
    mon: 'Lunedì',
    tue: 'Martedì',
    wed: 'Mercoledì',
    thu: 'Giovedì',
    fri: 'Venerdì',
    sat: 'Sabato',
    sunShort: 'Dom',
    monShort: 'Lun',
    tueShort: 'Mar',
    wedShort: 'Mer',
    thuShort: 'Gio',
    friShort: 'Ven',
    satShort: 'Sab',
  },
};

export const USERNAME_STORAGE_KEY = '@Username:key';

export const NOTIFICATION_DAYS_KEY = '@NotificationDays:key';
export const NOTIFICATION_HOUR_KEY = '@NotificationHour:key';

import { SCRIPT } from './urls.js';

const SCRIPT_URL = SCRIPT;
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

export function setUserInfo(value) {
  return setStorageItem(USERNAME_STORAGE_KEY, value);
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

export function getNotificationDays() {
  return AsyncStorage.getItem(NOTIFICATION_DAYS_KEY);
}

export function setNotificationDays(days) {
  return AsyncStorage.setItem(NOTIFICATION_DAYS_KEY, days);
}

export function getNotificationHour() {
  return AsyncStorage.getItem(NOTIFICATION_HOUR_KEY);
}

export function setNotificationHour(hour) {
  return AsyncStorage.setItem(NOTIFICATION_HOUR_KEY, hour);
}

export function getNotificationTime() {
  return AsyncStorage.multiGet([NOTIFICATION_DAYS_KEY, NOTIFICATION_HOUR_KEY]);
}

export function formatTimeParts(timePart) {
  return timePart >= 10 ? timePart : '0' + timePart;
}
