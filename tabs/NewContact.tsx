import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar, Switch, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import ImagePicker, { ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import API_URL from '../utils/environment';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateContactProps {
  navigation: any; // Replace 'any' with the actual type of your navigation prop
}

const CreateContact: React.FC<CreateContactProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [mobile, setMobile] = useState<string | undefined>(undefined);
  const [landline, setLandline] = useState<string | undefined>(undefined);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [image, setImage] = useState('');

  const toggleSwitch = () => setFavorite((previousState) => !previousState);

  
  const uploadImage = () => {
   
  };

 
  const newContact = async () => {
    console.warn('Save clicked');
    const url = API_URL;
    
    // Generate a unique ID for the contact
    const contactId = 'contact_' + Date.now().toString();
    
    // Create the contact data object
    const contactData = {
      id: contactId,
      displayName,
      mobile,
      landline,
      favorite,
      image,
    };
    
    try {
      // Save the contact data to AsyncStorage using the generated ID
      await AsyncStorage.setItem(contactId, JSON.stringify(contactData));
    
      console.warn('User Added');
    
      // Clear input fields and reset state
      setDisplayName('');
      setMobile(undefined);
      setLandline(undefined);
      setFavorite(false);
      setImage('');
    
      // Navigate to the 'ContactList' screen
      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>
        Mark as Fav: {favorite ? '✅' : '❌'}
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={favorite ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={favorite}
        />
      </Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.icon} onPress={uploadImage}>
        📷
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={displayName}
          onChangeText={(text) => setDisplayName(text)}
          clearButtonMode="always"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="number-pad"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
          clearButtonMode="always"
        />
        <TextInput
          style={styles.input}
          placeholder="Landline Number"
          keyboardType="number-pad"
          value={landline}
          onChangeText={(text) => setLandline(text)}
          clearButtonMode="always"
        />
      </View>
      <View style={styles.btn}>
        <Button onPress={newContact} title="Save" />
        <Button title="Close" color={'red'} onPress={() => navigation.navigate('ContactList')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    padding: 10,
    margin: 20,
    marginTop: 80,
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    padding: 10,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  txt: {
    fontSize: 20,
    marginHorizontal: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 50,
    alignSelf: 'center',
    margin: 20,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CreateContact;
