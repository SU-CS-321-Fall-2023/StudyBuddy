// In App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
// At the top of your app (outside any component)
if (!global.userStudyGroups) global.userStudyGroups = ['Study Group 1', 'Study Group 2'];


const App = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default App;

