import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailsScreen from '../Screens/ProductsDetailScreen';
import ProductsScreen from '../Screens/ProductsScreen/SkinCareProductsScreen';

export default function ProductsScreenStackNav() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="products" component={ProductsScreen} 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name="product-detail" component={ProductDetailsScreen}
      options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  )}