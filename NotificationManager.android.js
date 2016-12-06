import PushNotification from 'react-native-push-notification';

export default class NotificationManager {

  static clearNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static setNotification(date) {
    console.log(date);
    PushNotification.localNotificationSchedule({
      title: 'App Pranzi',
      message: 'Remember to register what you ate!',
      repeatType: 'week',
      date: date,
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
