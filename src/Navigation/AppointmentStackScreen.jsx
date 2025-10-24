import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpertSelectionScreen from '../Screens/ExpertSelection/ExpertSelectionScreen';
import TimeSlotScreen from '../Screens/TimeSlotScreen/TimeSlotScreen';

export default function AppointmentStackScreen() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="select-expert" component={ExpertSelectionScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="time-slot" component={TimeSlotScreen}
      options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  )
}
