import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '../Screens/HistoryScreen';
import HistoryDetailScreen from '../Screens/HistoryDetailScreen';

export default function HistorySceenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="history" component={HistoryScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="history-detail" component={HistoryDetailScreen}
      options={{
        headerShown: false,
      }}/>
    </Stack.Navigator>
  );
}
