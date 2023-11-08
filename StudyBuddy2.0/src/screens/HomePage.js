import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();
  const [studyGroups, setStudyGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateStudyGroup = () => {
    const newGroup = { id: Date.now().toString(), name: newGroupName.trim() };
    setStudyGroups([...studyGroups, newGroup]);
    setModalVisible(false); // Close the modal
    setNewGroupName(''); // Reset the input field
  };

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Navigate back to the Sign In screen
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Create Study Group</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Study Buddy</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Search for study groups..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredGroups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text>{item.name}</Text>
            <Button title="Join" onPress={() => {}} />
          </View>
        )}
      />
      {/* Modal for creating a new study group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Study Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={styles.modalInput}
            />
            <Button title="Create" onPress={handleCreateStudyGroup} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distributes space between items
    alignItems: 'center',
    padding: 10,
    paddingTop: 10, // Add padding at the top if you want to lower the header elements
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute', // Position absolutely to center it
    left: 4,
    right: 0,
    bottom: -20,
    textAlign: 'center', // Center the text
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    bottom: -17,
  },
  groupItem: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // ... other styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  // button: {
  //   backgroundColor: 'lightblue', // or any color you want
  //   padding: 8,
  //   borderRadius: 5,
  // },
  buttonText: {
    // color: 'white', // choose a text color that suits your app
  },
  // ... other styles
});

export default HomePage;


