import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import TabNavigation from './TabNavigation';
import NotificationScreen from '../Screens/NotificationsScreen';
import AvailabilityScreen from '../Screens/AvailabilityScreen';
import AppointmentStackScreen from './AppointmentStackScreen';
import MyAppointmentsScreen from '../Screens/MyAppointmentsScreen';
import ExpertAppointmentsScreen from '../Screens/ExpertAppointmentsScreen';
import ChatScreen from '../Screens/ChatScreen';
import CustomDrawerContent from '../components/CustomDrawerContent ';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({userRole}) {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} userRole={userRole} />}
      screenOptions={({ route }) => ({
        drawerIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'home-tabs') {
            iconName = 'home';
            return <Entypo name={iconName} size={24} color="black" />;
          } else if (route.name === 'notifications') {
            return <AntDesign name="notification" size={24} color="black" />;
          } else if (route.name === 'appointment') {
            return <AntDesign name="calendar" size={24} color="black" />
          } else if (route.name === 'available-timeslot') {
            return <AntDesign name="clockcircleo" size={24} color="black" />
          } else if (route.name === 'my-appointment') {
            return <AntDesign name="clockcircleo" size={24} color="black" /> 
          } else if (route.name === 'appointment-exp') {
            return <AntDesign name="solution1" size={24} color="black" /> 
          } else if (route.name === 'chat') {
            return <AntDesign name="message1" size={24} color="black" />
 
          }
        },
        drawerActiveTintColor: '#6BA292',
    //     drawerStyle: {
    //       backgroundColor: '#e0f2f1', // match your profile section
    // },

      })}
    >
      <Drawer.Screen
        name="home-tabs"
        component={TabNavigation}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="notifications"
      component={NotificationScreen}
      options={{ title: 'Notification'}}
      />
      {userRole === 'user' && (
        <Drawer.Screen name="appointment"
        component={AppointmentStackScreen}
        options={{ title: 'Set Appointment'}}
        />
      )}
      {userRole === 'expert' && (
        <Drawer.Screen name="available-timeslot"
        component={AvailabilityScreen}
        options={{ title: 'Available TimeSlot'}}
        />
      )}
      {userRole === 'user' && (
        <Drawer.Screen name="my-appointment"
        component={MyAppointmentsScreen}
        options={{ title: 'My Appointments'}}
        />
      )}

      {userRole === 'expert' && (
        <Drawer.Screen name="appointment-exp"
        component={ExpertAppointmentsScreen}
        options={{ title: 'Appointments'}}
        />
      )}

      <Drawer.Screen name="chat"
        component={ChatScreen}
        options={{ title: 'Chat', headerShown: false}}
        />

    </Drawer.Navigator>
  );
}
