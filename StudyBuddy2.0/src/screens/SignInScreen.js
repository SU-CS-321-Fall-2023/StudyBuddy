import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  {/*LOGIN STREAK BADGE -- CHECK LOGIN STREAK FUNCTION */}

  return (
    <ImageBackground
      source={require('./images/SignUp.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
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
      <TouchableOpacity
  style={styles.signinButton}
  onPress={() => navigation.navigate('Home')}
>
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>
      {/* <Button title="Sign in" onPress={handleSignIn} /> */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
  signinButton: {
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

export default SignInScreen;


