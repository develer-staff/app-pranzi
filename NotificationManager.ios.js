import { PushNotificationIOS } from 'react-native';

import I18n from 'react-native-i18n';

export default class NotificationManager {

  static clearNotifications() {
    PushNotificationIOS.cancelAllLocalNotifications();
  }

  static setNotification(date) {
    PushNotificationIOS.scheduleLocalNotification({
      fireDate: date.toISOString(),
      alertBody: I18n.t('notificationText'),
      repeatInterval: 'week',
    });
  }

  static scheduleNotificationInSecs(secs) {
    PushNotificationIOS.scheduleLocalNotification({
      fireDate: new Date(Date.now() + secs * 1000).toISOString(),
      alertBody: I18n.t('notificationText'),
    });
  }

  static setNotifications(dates) {
    dates.forEach((date) => {
      NotificationManager.setNotification(date);
    });
  }

  static resetNotifications(dates) {
    NotificationManager.clearNotifications();
    NotificationManager.setNotifications(dates);
  }
}
