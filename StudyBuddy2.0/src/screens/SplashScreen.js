import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Opacity value for the splash text
  const fadeAnim = useRef(new Animated.Value(0)).current; // start as invisible

  useEffect(() => {
    // Start fading in the splash text
    Animated.timing(fadeAnim, {
      toValue: 1, // animate to fully visible
      duration: 2000, // duration of fade in
      useNativeDriver: true,
    }).start(() => {
      // After the text is fully visible, start fading out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0, // animate to fully transparent
          duration: 2000, // duration of fade out
          useNativeDriver: true,
        }).start(() => {
          // After the fade out, navigate to the SignUp screen
          navigation.replace('SignUp');
          
        });
      }, 2000); // the delay before starting the fade out
    });
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fadeContainer, { opacity: fadeAnim }]}>
        <Text style={styles.fadeText}>Study Buddy</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set your desired background color
  },
  fadeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadeText: {
    fontSize: 28,
    fontWeight: 'bold',
    // Include other styling for your text
  },
});

export default SplashScreen;



