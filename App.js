import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, Alert, Platform } from 'react-native';

import * as Notifications from 'expo-notifications';

import { useEffect } from 'react';

const EXPO_PROJECT_ID = '576522f5-8c0c-4792-b82a-1997b9e01cc9';

const EXPO_DEVICETOKEN = 'ExponentPushToken[PLzOZ1EMrV5qkg0lGtREoI]';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("testing");
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    };
  }
});

// Notifications


export default function App() {

  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert("Permission required", "Push notification need to allow");
        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: EXPO_PROJECT_ID,
      });
      console.log(pushTokenData);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT
        })
      }


    }

    // if (Device.isDevice) {
    //   console.log("this is device")
    // } else {
    //   console.log("This is not a device");
    // }
    configurePushNotifications();



  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification Received");
      console.log(notification);
      const userName = notification.request.content.data.userName;
      console.log(userName);
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Response Received");
      console.log(response);
      const userName = response.notification.request.content.data.userName;
      console.log(userName);
    })

    return () => {
      subscription1.remove();
      subscription2.remove();
    }
  }, [])



  const getPermissionsHandler = async () => {
    const settings = await Notifications.getPermissionsAsync();

    const isGranted = settings.granted;
    if (isGranted) {
      Alert.alert(
        "Permission has already been granted!",
        "You can receive notifications"
      );
    } else {
      const request = await Notifications.requestPermissionsAsync();

      if (request.granted) {
        Alert.alert(
          "You have granted permissions",
          "You can now receive notifications"
        );
      } else {
        Alert.alert(
          "You did not grant permissions",
          "You will be unable to receive notifications"
        );
      }
    }
  };

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "This is notification title",
        body: "This is notification body.",
        data: {
          userName: "satanand",
        }
      },
      trigger: {
        seconds: 5
      },
    });
  }

  function sendNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: EXPO_DEVICETOKEN,
        title: 'Test - send from a device',
        body: 'This is a test!',
        data: {
          userName: "satanand"
        }

      })
    });

  }



  return (
    <View style={styles.container}>
      <Button title='Get Permissions' onPress={getPermissionsHandler} />
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler} />
      <Button title='Send Notification' onPress={sendNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
