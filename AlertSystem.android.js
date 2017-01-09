'use strict';

import {
  ToastAndroid
} from 'react-native';

export default class AlertSystem {
    static alert(title, message){
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
}