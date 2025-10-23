import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientProfileScreen from '../Screens/ProfileScreen/PatientProfileScreen';
import EditProfileScreen from '../Screens/EditProfileScreen';

export default function ProductsScreenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="profile" component={PatientProfileScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="edit-profile" component={EditProfileScreen}
      options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  )}