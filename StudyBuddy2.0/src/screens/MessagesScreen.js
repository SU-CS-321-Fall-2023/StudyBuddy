import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 18,
    color: 'blue',
  },
  logoutButton: {
    fontSize: 18,
    color: 'blue',
  },
  messageItem: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
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
  // ... other styles you may need
});

export default MessagesScreen;
