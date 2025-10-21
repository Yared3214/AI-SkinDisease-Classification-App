// src/utils/permissions.js
import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissions = async () => {
  if (Platform.OS !== 'android') return;
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ]);

    const allGranted = Object.values(granted).every(
      status => status === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) console.warn('Some permissions were not granted');
  } catch (err) {
    console.warn('Permission request failed', err);
  }
};
