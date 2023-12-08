import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  {/*LOGIN STREAK BADGE -- CHECK LOGIN STREAK FUNCTION */}

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8001/api/signup", { firstName, lastName, email, password, confirmPassword});
      alert("Sign Up Successful");
    } catch (error) {
      // Handle the error appropriately
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <ImageBackground
      source={require('./images/SignUp.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
    <View style={{ marginVertical: 100 }}>
      <Text style={styles.header}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoComplete='email' keyboardType='email-address'
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry = {true} autoCompleteType='password'
      />
      <TouchableOpacity
  style={styles.signinButton}
  onPress={handleSubmit}
>
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.signUpGoogleButton}
  onPress={() => navigation.navigate('Home')}
>
  <Text style={styles.buttonText}>Sign Up with Google</Text>
</TouchableOpacity>

      {/* <Button title="Sign in" onPress={handleSignIn} /> */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAwareScrollView>
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
  signUpGoogleButton: {
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: 150,
    top: 10,
  },
});

export default SignInScreen;


