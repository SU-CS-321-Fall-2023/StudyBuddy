import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ImageBackground, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  // Dummy data for the example. Replace with state and context where necessary.
  const userInfo = {
    fullName: 'Billy McBillerson',
    email: 'billysilly@gmail.com',
    profilePic: 'https://via.placeholder.com/150', // Replace with actual image path
    emailNotifications: 'turn off', //may be better to just have the user unsubsribe through
    //the email that's been sent(gmail may automatically have that set up i believe)
    

    //STATS AND BADGES FOR SKYLER
    stats: ['Stat 1', 'Stat 2'],
    badges: ['Badge 1', 'Badge 2'],
    //STATS AND BADGES FOR SKYLER



    studyGroups: ['Study Group 1', 'Study Group 2'],
    classes: ['Class 1', 'Class 2'],
    likes: ['Like 1', 'Like 2'],
    skills: ['Skill 1', 'Skill 2'],
    strengths: ['Strength 1', 'Strength 2'],
    weaknesses: ['Weakness 1', 'Weakness 2']
    // Additional sections like 'Likes', 'Skills', etc. would be handled similarly
  };

  // State to handle the addition and removal of classes.
  const [classes, setClasses] = useState(userInfo.classes);
  const [newClass, setNewClass] = useState('');
  const [likes, setLikes] = useState(userInfo.likes);
  const [newLikes, setNewLikes] = useState('');
  const[skills, setSkills] = useState(userInfo.skills);
  const[newSkills, setNewSkills] = useState('');
  const[strengths, setStrengths] = useState(userInfo.strengths);
  const[newStrengths, setNewStrengths] = useState('');
  const[weaknesses, setWeaknesses] = useState(userInfo.weaknesses);
  const[newWeaknesses, setNewWeaknesses] = useState('');
  //do weaknesses

  const handleAddClass = () => {
    setClasses([...classes, newClass]);
    setNewClass('');
  };

  const handleAddLikes = () => {
    setLikes([...likes,newLikes]);
    setNewLikes('');
  }
  const handleAddSkill = () => {
    setSkills([...skills,newSkills]);
    setNewSkills('');
  }

  const handleAddStrength = () => {
    setStrengths([...strengths,newStrengths]);
    setNewStrengths('');
  }

  const handleAddWeakness = () => {
    setWeaknesses([...weaknesses,newWeaknesses]);
    setNewWeaknesses('');
  }

  const handleRemoveClass = (index) => {
    const updatedClasses = classes.filter((_, classIndex) => classIndex !== index);
    setClasses(updatedClasses);
  };

  const handleRemoveLike = (index) => {
    const updatedLikes = likes.filter((_, likeIndex) => likeIndex !== index);
    setLikes(updatedLikes);
  }
  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, skillIndex) => skillIndex !== index);
    setSkills(updatedSkills);
  }
  const handleRemoveStrength = (index) => {
    const updatedStrengths = strengths.filter((_, strengthIndex) => strengthIndex !== index);
    setStrengths(updatedStrengths);
  }
  const handleRemoveWeakness = (index) => {
    const updatedWeaknesses = weaknesses.filter((_, weaknessIndex) => weaknessIndex !== index);
    setWeaknesses(updatedWeaknesses);
  }

  {/*FIRST BUDDY BADGE FUNCTION*/}
  

  return (
    <ImageBackground
      source={require('./images/UserProfile.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userInfo.fullName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: userInfo.profilePic }} style={styles.profilePic} />
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Email: {userInfo.email}</Text>
          <Text style={styles.infoText}>Email Notifications: {userInfo.emailNotifications}</Text>
          <Text style={styles.infoText}>Name: {userInfo.fullName}</Text>
        </View>
      </View>




      {/*BADGES FOR SKYLER*/}
      <Text style={styles.sectionTitle}>Stats</Text>
      <FlatList
        data={userInfo.stats}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
        horizontal
      />
      <Text style={styles.sectionTitle}>Badges</Text>
      <FlatList
        data={userInfo.badges}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
        horizontal
      />
      {/*BADGES FOR SKYLER*/}





      <Text style={styles.sectionTitle}>Study Groups</Text>
      <FlatList
        data={userInfo.studyGroups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
        horizontal
      />

      <Text style={styles.sectionTitle}>Classes</Text>
      <View style={styles.classesList}>
        {classes.map((classItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.listItem}>{classItem}</Text>
            <TouchableOpacity onPress={() => handleRemoveClass(index)}>
              <Ionicons name="remove-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addClassSection}>
        <TextInput
          style={styles.classInput}
          placeholder="New class"
          value={newClass}
          onChangeText={setNewClass}
        />
        <TouchableOpacity onPress={handleAddClass}>
          <Ionicons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Likes</Text>
      <View style={styles.classesList}>
        {likes.map((likeItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.listItem}>{likeItem}</Text>
            <TouchableOpacity onPress={() => handleRemoveLike(index)}>
              <Ionicons name="remove-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addClassSection}>
        <TextInput
          style={styles.classInput}
          placeholder="New like"
          value={newLikes}
          onChangeText={setNewLikes}
        />
        <TouchableOpacity onPress={handleAddLikes}>
          <Ionicons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.classesList}>
        {skills.map((skillItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.listItem}>{skillItem}</Text>
            <TouchableOpacity onPress={() => handleRemoveSkill(index)}>
              <Ionicons name="remove-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addClassSection}>
        <TextInput
          style={styles.classInput}
          placeholder="New Skill"
          value={newSkills}
          onChangeText={setNewSkills}
        />
        <TouchableOpacity onPress={handleAddSkill}>
          <Ionicons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Strengths</Text>
      <View style={styles.classesList}>
        {strengths.map((strengthItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.listItem}>{strengthItem}</Text>
            <TouchableOpacity onPress={() => handleRemoveStrength(index)}>
              <Ionicons name="remove-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addClassSection}>
        <TextInput
          style={styles.classInput}
          placeholder="New Strength"
          value={newStrengths}
          onChangeText={setNewStrengths}
        />
        <TouchableOpacity onPress={handleAddStrength}>
          <Ionicons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Weaknesses</Text>
      <View style={styles.classesList}>
        {weaknesses.map((weaknessItem, index) => (
          <View key={index} style={styles.classItem}>
            <Text style={styles.listItem}>{weaknessItem}</Text>
            <TouchableOpacity onPress={() => handleRemoveWeakness(index)}>
              <Ionicons name="remove-circle" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.addClassSection}>
        <TextInput
          style={styles.classInput}
          placeholder="New Weakness"
          value={newWeaknesses}
          onChangeText={setNewWeaknesses}
        />
        <TouchableOpacity onPress={handleAddWeakness}>
          <Ionicons name="add-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Additional sections would follow a similar pattern to 'Classes' */}
      
      {/* Rest of the profile sections... */}
    </ScrollView>
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    fontSize: 18,
    color: 'white',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoSection: {
    marginLeft: 20,
    
  },
  infoText: {
    fontSize: 18,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'white',
  },
  listItem: {
    margin: 10,
    color: 'white'
  },
  classesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  addClassSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  classInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  // Define additional styles as needed
});

export default ProfileScreen;