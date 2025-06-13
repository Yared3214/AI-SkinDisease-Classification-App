import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../Screens/AdminHomeScreen';
import PostProductScreen from '../Screens/PostProductScreen';
import VerifyExpertsScreen from '../Screens/VerifyExpertsScreen';
import ExpertDetailScreen from '../Screens/ExpertDetailScreen';
import AdminProductsScreen from '../Screens/AdminProductsScreen';

export default function HomeScreenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="admin-home" component={AdminHomeScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="product" component={AdminProductsScreen}
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="post-product" component={PostProductScreen}
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="verify-expert" component={VerifyExpertsScreen}
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="expert-detail" component={ExpertDetailScreen}
      options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
}
