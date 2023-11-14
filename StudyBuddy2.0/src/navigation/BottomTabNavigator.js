import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Import ProfileScreen
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, // This hides the header for all tab screens
    }}>
    <Tab.Screen 
      name="HomePage" 
      component={HomePage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
      }} 
    />
    <Tab.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;

