import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,KeyboardAvoidingView,
    Platform } from 'react-native';
const MessageDetailScreen = ({ route }) => {
  const { name, message } = route.params;


  {/*FUNCTION FOR CHAT MESSAGING WILL GO HERE */}

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}>{name}</Text> */}
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <TextInput
        placeholder="Type a message..."
        style={styles.input}
        // Add additional TextInput props as needed
      />
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // Style your header
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 20,
    // Other styling properties
  },
  messageContainer: {
    flex: 1,
    alignItems: 'flex-start', // Align to the start of the screen
    padding: 10, 
    // Style your message container
  },
  messageText: {
    backgroundColor: 'white', // Set the background color to white
    borderRadius: 20, // Round the corners
    padding: 15, // Add some padding inside the message box
    borderWidth: 1, // Optional: if you want a border
    borderColor: '#ddd', // Optional: if you want a border
    maxWidth: '80%', // Ensure the message box doesn't stretch too far
    alignSelf: 'flex-start', // Align to the start of the messageContainer
    marginLeft: 20,
    // Style your message text
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    // Other styling properties
  },
  // Add other styles as needed
});

export default MessageDetailScreen;
