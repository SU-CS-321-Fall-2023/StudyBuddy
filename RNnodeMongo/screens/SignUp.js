import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (name === "" || email === "" || password === "") {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8001/api/signup", { name, email, password });
      alert("Sign Up Successful");
    } catch (error) {
      // Handle the error appropriately
      alert("Signup failed: " + error.message);
    }
  };
  
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
    <View style={{ marginVertical: 100 }}>
      <Text style={styles.signUpText}>Sign Up</Text>

      <View style={{ marginHorizontal: 24 }}>
        <Text style={{ fontSize: 16, color: '#8e93a1' }}>NAME</Text>
        <TextInput
          style={styles.signupInput}
          value={name}
          onChangeText={text => setName(text)}
          autoCapitalize='words' autoCorrect = {false}
        />
      </View>

      <View style={{ marginHorizontal: 24 }}>
        <Text style={{ fontSize: 16, color: '#8e93a1' }}>EMAIL</Text>
        <TextInput
          style={styles.signupInput}
          value={email}
          onChangeText={text => setEmail(text)}
          autoComplete='email' keyboardType='email-address'
        />
      </View>

      <View style={{ marginHorizontal: 24 }}>
        <Text style={{ fontSize: 16, color: '#8e93a1' }}>PASSWORD</Text>
        <TextInput
          style={styles.signupInput}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry = {true} autoComplteType='password'
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* <Text style={{ marginHorizontal: 24 }}>
        {JSON.stringify({ name, email, password })}
      </Text> */}

      <Text style = {{fontSize: 12, textAlign: 'center'}}>
        Already Joined? Sign in
      </Text>
    </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 30,
    textAlign: 'center',
  },
  signupInput: {
    borderBottomWidth: 0.5,
    height: 48,
    borderBottomColor: '#8e93a1',
    marginBottom: 30,
  },

  buttonStyle: {
    backgroundColor: "darkmagenta",
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold"
  },
});

export default SignUp;
