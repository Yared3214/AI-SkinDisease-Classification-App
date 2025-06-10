import { useEffect } from 'react';
import {PermissionsAndroid} from 'react-native';
import messaging from "@react-native-firebase/messaging";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted")
    } else {
        console.log("Notification permission denied")
    }
}

const getToken = async () => {
    try {
        const token = await messaging().getToken() 
        console.log("FCM Token:", token)
        const userId = auth().currentUser?.uid;

    } catch (error) {
        console.error("Failed to get FCM Token", error)
    }
}


export const useNotification = () => {
    useEffect(()=> {
        requestUserPermission()
        getToken()
    },[])
}