import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';



const SignUpScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(1); // Initial opacity for the splash overlay

  useEffect(() => {
    // Wait for a few seconds, then fade out the splash overlay
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade to transparent
        duration: 2000, // Duration for fade-out
        useNativeDriver: true,
      }).start(() => setIsSplashVisible(false)); // Hide splash overlay after fade-out
    }, 2000); // Time before starting the fade-out

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);

  return (
    <ImageBackground
      source={require('./images/SignUp.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity
  style={styles.signupButton}
  onPress={() => navigation.navigate('Home')}
>
  <Text style={styles.buttonText}>Sign Up</Text>
</TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>{/* <Button title="Sign Up" onPress={handleSignUp} /> */}
        <Text style={styles.linkText}>Already have an account? 
        Sign in</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 120,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textDecorationLine: 'underline'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: 250,
    height:60,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  linkText: {
    color: 'white',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: 100,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize:20,
    // You might want to set a specific font size or weight
  },
});

export default SignUpScreen;

