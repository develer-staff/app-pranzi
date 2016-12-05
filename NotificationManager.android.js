import PushNotification from 'react-native-push-notification';

export default class NotificationManager {

  static clearNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  static setNotification(date){
    PushNotification.localNotificationSchedule({
      title: 'App Pranzi',
      message: 'Remember to register what you ate!',
      repeatType: 'hour',
      date: date,
    });
  }

  static setNotifications(...dates){
    dates.forEach(date => {
      setNotification(date);
    });
  }

  static resetNotifications(...dates){
    clearNotifications();
    setNotifications(dates);
  }
}
