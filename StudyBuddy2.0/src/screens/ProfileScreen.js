import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userInfo.fullName}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: userInfo.profilePic }} style={styles.profilePic} />
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Email: {userInfo.email}</Text>
          <Text style={styles.infoText}>Email Notifications: {userInfo.emailNotifications}</Text>
          <Text style={styles.infoText}>Name: {userInfo.fullName}</Text>




          

          {/* LINK TO PRIVACY POLICY GOES HERE*/}
          <Text style={styles.infoText}>
          Privacy Policy: 
          <TouchableOpacity onPress={() => {
          Linking.openURL('https://study-buddy-privacy-policy.vercel.app/').catch(err => console.error("Couldn't load page", err));
          }}>
          <Text style={styles.linkText}>Click Here</Text>
          </TouchableOpacity>
          </Text>
          {/* LINK TO PRIVACY POLICY GOES HERE*/}



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
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize:16,
    right: -5,
    top: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listItem: {
    margin: 10,
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
    borderBottomWidth: 1,
    flex: 1,
    marginRight: 10,
  },
  // Define additional styles as needed
});

export default ProfileScreen;