// In src/navigation/BottomTabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import MessagesScreen from '../screens/MessagesScreen';
import { Ionicons } from '@expo/vector-icons';

// Import other screens you want to include in the bottom tabs

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
  screenOptions={{
    headerShown: false, // This hides the header for all tab screens
  }}>
    {/* Define tabs and their associated screens here */}
    <Tab.Screen name="HomePage" component={HomePage} /* ... */ />
    {/* ... other tabs */}
    <Tab.Screen
  name="Messages"
  component={MessagesScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="chatbubble-outline" color={color} size={size} />
    ),
  }}
/>
  </Tab.Navigator>
);

export default BottomTabNavigator;

