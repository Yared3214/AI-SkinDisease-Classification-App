import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
    useNavigation,
  } from '@react-navigation/native';

export default function NotificationsScreen() {
    const navigation = useNavigation();

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()}>Go back home</Button>
      </View>
    );
  }
