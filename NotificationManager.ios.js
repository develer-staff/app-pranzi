import PushNotification from 'react-native-push-notification';

import I18n from 'react-native-i18n';

export default class NotificationManager {

  static clearNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static setNotification(date) {
    console.log('Setting notification for date: ');
    console.log(date);
    PushNotification.localNotificationSchedule({
      title: 'App Pranzi',
      message: I18n.t('notificationText'),
      repeatType: 'week',
      date: date,
    });
  }

  static scheduleNotificationInSecs(secs) {
    console.log(`Scheduling local notification in ${secs} seconds`);
    PushNotification.localNotificationSchedule({
      title: 'App Pranzi',
      message: I18n.t('notificationText'),
      date: new Date(Date.now() + secs * 1000),
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
