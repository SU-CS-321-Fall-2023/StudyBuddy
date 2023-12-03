import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ImageBackground, Image } from 'react-native';

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
      <ImageBackground
      source={require('./images/StartingPage.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <Animated.View style={[styles.fadeContainer, { opacity: fadeAnim }]}>
        <Text style={styles.fadeText}>Study Buddy</Text>
        <Image
    source={require('./images/StudyBuddyLogo4.png')} // Replace with the path to your image
    style={styles.imageStyle} // Define your image style
  />

      </Animated.View>
      </ImageBackground>
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
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    // Include other styling for your text
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 300, // Set the width
    height: 300, // Set the height
    resizeMode: 'contain', // or 'cover', depending on what you need
  },
});

export default SplashScreen;



