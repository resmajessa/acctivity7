import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import StudentsData from './Table';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

const sHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const [hidePassword, setHidePassword] = useState(true);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const addStudentProfile = async () => {
    const newStudentData = {
      ID: uuidv4(),
      fName,
      lName,
      course,
      username,
      password,
    };

    try {
      if (fName !== '' && lName !== '' && course !== '' && username !== '' && password !== '')
        {
          const storedStudentData = JSON.parse(await AsyncStorage.getItem('students')) || [];
          const updatedStudentList = [...storedStudentData, newStudentData];
          await AsyncStorage.setItem('students', JSON.stringify(updatedStudentList));
  
        toast.show("Student Profile Added Successfully!", {
          type: "success",
          placement: "bottom",
          duration: 2500,
          offset: 30,
          animationType: "zoom-in",
        });
        setFName('');
        setLName('');
        setCourse('');
        setUsername('');
        setPassword('');
      }
      else{
        toast.show("Please fill in all the required fields!", {
          type: "warning",
          placement: "bottom",
          duration: 2500,
          offset: 30,
          animationType: "zoom-in",
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputFields}
        placeholder="First Name"
        value={fName}
        onChangeText={setFName}
      />
      <TextInput
        style={styles.inputFields}
        placeholder="Last Name"
        value={lName}
        onChangeText={setLName}
      />
      <Picker
        selectedValue={course}
        style={styles.inputFields}
        mode={'dropdown'}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Select Course" />
        <Picker.Item label="BSIT" value="BSIT" />
        <Picker.Item label="BSN" value="BSN" />
        <Picker.Item label="BSED" value="BSED" />
        <Picker.Item label="BSCS" value="BSCS" />
        <Picker.Item label="BSAP" value="BSAP" />
        <Picker.Item label="BSHM" value="BSHM" />
        <Picker.Item label="BSBA" value="BSBA" />
        <Picker.Item label="BSCRIM" value="BSCRIM" />
        </Picker>
      <TextInput
        style={styles.inputFields}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Password"
        secureTextEntry={hidePassword}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
        <Ionicons
          name={hidePassword ? 'eye-off' : 'eye'}
          size={16}
          color="#000"
        />
      </TouchableOpacity>
      </View>
      <View style={{marginBottom:30}}>
        <Button 
          title="ADD STUDENT" 
          onPress={addStudentProfile} 
          color="#8059eb" 
        />
      </View>
      <View style={{marginBottom:30}}>
        <Button 
          title="VIEW STUDENTS LIST" 
          onPress={() => navigation.navigate('Student List')} 
          color="#8059eb" 
        />
      </View>
    </View>
  );
}
function StudentLists({ navigation }) {
  return (
    <View styles={{backgroundColor:'white'}}>
      <StudentsData />
      <Button 
        title="ADD STUDENT" 
        onPress={() => navigation.goBack()} 
        color="#8059eb" 
      />  
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AddProfilePage() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Student List" component={StudentLists} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <View style={{ flex: 1, padding: 20, }}>
      <ToastProvider>
        <NavigationContainer>
          <AddProfilePage />
        </NavigationContainer>
      </ToastProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: sHeight,
    backgroundColor:'white',
    padding: 20,
  },
  inputFields: {
    height: 50,
    borderColor: 'grey',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  iconContainer: {
    padding: 10,
  },
});

export default App;
