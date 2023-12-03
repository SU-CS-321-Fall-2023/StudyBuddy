import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState(global.messages || []);

  useEffect(() => {
    // Update messages from global state
    setMessages(global.messages);
  }, []);

  const openMessageDetail = (message) => {
    navigation.navigate('MessageDetail', { name: message.name, message: message.lastMessage });
  };

  return (
    <ImageBackground
      source={require('./images/HomePage.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>«Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.messageItem}
            onPress={() => openMessageDetail(item)}
          >
            <Text style={styles.messageName}>{item.name}</Text>
            <Text style={styles.messagePreview}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => {/* Logic to open contacts */}}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 30,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    // backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    fontSize: 18,
    color: 'white',
  },
  logoutButton: {
    fontSize: 18,
    color: 'white',
  },
  messageItem: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: .15,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
  },
  messageName: {
    fontWeight: 'bold',
  },
  messagePreview: {
    color: 'grey',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: 'blue',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  // ... other styles you may need
});

export default MessagesScreen;
