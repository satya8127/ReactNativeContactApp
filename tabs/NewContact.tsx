import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, StatusBar, Switch, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import ImagePicker, { ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';

import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateContactProps {
  navigation: any; // Replace 'any' with the actual type of your navigation prop
}

const CreateContact: React.FC<CreateContactProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [mobile, setMobile] = useState<string | undefined>(undefined);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [image, setImage] = useState('');
  const [email, setEmail] = useState<string>('');

  const toggleSwitch = () => setFavorite((previousState) => !previousState);

  
  const uploadImage = () => {
   
  };

 
  const newContact = async () => {
    console.warn('Save clicked');

    
    // Generate a unique ID for the contact
    const contactId = 'contact_' + Date.now().toString();
    
    // Create the contact data object
    const contactData = {
      id: contactId,
      displayName,
      mobile,
      email,
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
  
      setFavorite(false);
      setEmail('');
    
      // Navigate to the 'ContactList' screen
      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>
        Favourite: {favorite ? '✅' : '❌'}
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
  <View style={styles.inputIconContainer}>
    <Text style={styles.inputIcon}>👤</Text>
    <TextInput
      style={styles.input}
      placeholder="Name"
      value={displayName}
      onChangeText={(text) => setDisplayName(text)}
      clearButtonMode="always"
    />
  </View>
  <View style={styles.inputIconContainer}>
    <Text style={styles.inputIcon}>📞</Text>
    <TextInput
      style={styles.input}
      placeholder="Phone Number"
      keyboardType="number-pad"
      value={mobile}
      onChangeText={(text) => setMobile(text)}
      clearButtonMode="always"
    />
  </View>
  <View style={styles.inputIconContainer}>
    <Text style={styles.inputIcon}>✉️</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={(text) => setEmail(text)}
      clearButtonMode="always"
    />
  </View>
</View>
      <View style={styles.btn}>
        <Button onPress={newContact} title="Save" />
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
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
});

export default CreateContact;
