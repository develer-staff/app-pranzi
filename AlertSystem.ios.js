'use strict';

import {
  Alert
} from 'react-native';

export default class AlertSystem {
    static alert(title, message){
        Alert.alert(title, message);
    }
}