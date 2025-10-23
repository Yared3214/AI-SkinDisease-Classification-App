import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SkinImageUploadScreen from '../Screens/HomeScreen/HomeScreen';
import ResultScreen from '../Screens/ResultScreen';

export default function HomeScreenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={SkinImageUploadScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="analysis-result" component={ResultScreen}
      options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}
