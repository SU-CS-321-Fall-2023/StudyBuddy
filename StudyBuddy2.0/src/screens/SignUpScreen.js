import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = () => {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "508324923582-ncuan2li0la71d0oe8c317lg7l3d8g6d.apps.googleusercontent.com",
    iosClientId: "508324923582-qtv5h7tf8eub87iett2ek12hu6nflpv2.apps.googleusercontent.com",
    webClientId: "508324923582-colqt82dke17aa8n8n51msqric08j9sm.apps.googleusercontent.com",
  });
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

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  const handleSubmit = async () => {
    if (firstName === "" || email === "" || password === "" || lastName === "" || confirmPassword == "") {
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
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        autoCapitalize='words' autoCorrect = {false}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        autoCapitalize='words' autoCorrect = {false}
      />
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
        secureTextEntry = {true} autoComplteType='password'
      />
      <TextInput
        placeholder="Re-enter Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry = {true} autoCompleteType='password'
      />

      
      <TouchableOpacity
  style={styles.signupButton}
  onPress={handleSubmit}
>
  <Text style={styles.buttonText}>Sign Up</Text>
</TouchableOpacity>

<View style={styles.container2}>
{!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
            navigation.navigate('Home')
          }}
          // onPress={async () => {
          //   await promptAsync();
          //   if (userInfo) { // Assuming userInfo gets updated with user data on successful login
          //     // Navigate to the home screen
          //     navigation.navigate('Home'); // Replace 'Home' with your home screen's name
          //   }
          // }}
        />
      ) : null 
      // (
      //   <View style={styles.card}>
      //     {userInfo?.picture && (
      //       <Image source={{ uri: userInfo?.picture }} style={styles.image} />
      //     )}
      //     <Text style={styles.text}>Email: {userInfo.email}</Text>
      //     <Text style={styles.text}>
      //       Verified: {userInfo.verified_email ? "yes" : "no"}
      //     </Text>
      //     <Text style={styles.text}>Name: {userInfo.name}</Text>
      //     {/* <Text style={styles.text}>{JSON.stringify(userInfo, null, 2)}</Text> */}
       //   </View>
      // )
    }
    <Button
        title="remove local store"
        onPress={async () => await AsyncStorage.removeItem("@user")}
      />
</View> 

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>{/* <Button title="Sign Up" onPress={handleSignUp} /> */}
        <Text style={styles.linkText}>Already have an account? 
        Sign in</Text>
      </TouchableOpacity>


      {/* <Text style={{ marginHorizontal: 24 }}>
        {JSON.stringify({ firstName, lastName, email, password, confirmPassword })}
      </Text> */}

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
  signUpGoogleButton: {
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: 150,
    top: 10,
  },
  container2:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:50,
  }
});

export default SignUpScreen;

