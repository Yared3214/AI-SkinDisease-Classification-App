import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EducationalResourceScreen from '../Screens/EducationalResources/EducationalResourcesScreen';
import ResourceDetailScreen from '../Screens/ResourceDetail/ResourceDetailScreen';
import AddEdcuationalResource from '../Screens/AddEducationalResource/AddEducationalResource';

export default function EducationalResourceScreenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="resources" component={EducationalResourceScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="resource-detail" component={ResourceDetailScreen}
      options={{
        headerShown: false,
      }}/>
      <Stack.Screen name="add-resource" component={AddEdcuationalResource}
      options={{
        headerShown: false,
      }}/>
    </Stack.Navigator>
  );
}
