// In src/navigation/AppNavigator.js
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import HomePage from '../screens/HomePage';
import BottomTabNavigator from './BottomTabNavigator';
import MessageDetailScreen from '../screens/MessageDetailScreen';
import SplashScreen from '../screens/SplashScreen';
// ... other imports

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false, animation: 'none' }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false, animation: 'none'}} />
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen
  name="MessageDetail"
  component={MessageDetailScreen}
  options={({ route }) => ({ title: route.params.name })}
/>
    {/* ... other screens */}
  </Stack.Navigator>
  
);

export default AppNavigator;


